function newCriteria(title, pointsPossible, terminateOnFail, gradingFunction) {
  const thisCriteria = {
    pointsPossible,
    points: 0,
    title,
    terminateOnFail,
    grade: gradingFunction,
  };
  return thisCriteria;
}

function rubricToObject(rubric) {
  const rubricObject = {};
  let index = 0;
  for (const [key, value] of rubric) {
    rubricObject[key] = {
      points: value.points,
      pointsPossible: value.pointsPossible,
      title: value.title,
      order: index,
    };
    index += 1;
  }
  return rubricObject;
}
const rubricToJSON = (rubric) => JSON.stringify(rubricToObject(rubric));

function countElementsCriteria(title, pointsPossible, terminateOnFail,
  elementCountExpected, selector) {
  return newCriteria(title, pointsPossible, terminateOnFail, async (page) => {
    try {
      const elementCount = await page.evaluate((localSelector) => { /* eslint-env browser */
        const foundElements = document.querySelectorAll(localSelector);
        return foundElements.length;
      }, selector);
      if (elementCount === elementCountExpected) {
        return pointsPossible;
      }
    } catch (error) {
      return 0;
    }
    return 0;
  });
}

module.exports = {
  rubricToJSON,
  countElementsCriteria,
  newCriteria,
};
