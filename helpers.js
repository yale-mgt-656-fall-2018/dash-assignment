const puppeteer = require('puppeteer');

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

const rubricToJSON = (rubric) => {
  const tabSize = 4;
  // pretty-print JSON string to improve readibility
  return JSON.stringify(rubricToObject(rubric), null, tabSize);
};

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

function checkDashURL(expectedSuffix) {
  const checkerFunc = async (page, url) => {
    if (typeof url !== 'string') {
      // Invalid URL
      return 0;
    }
    if (url.startsWith('https://dash.generalassemb.ly/') === false) {
      // Invalid URL
      return 0;
    }
    if (url.endsWith(expectedSuffix) === false) {
      // Invalid URL
      return 0;
    }
    try {
      await page.goto(url, {
        timeout: 5000,
      });
    } catch (error) {
      // Valid URL but site is down
      return 1;
    }
    return 10;
  };
  return checkerFunc;
}

const gradeProject = async (rubric, url) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  // Uncomment to see console.log statements in the Chrome client.
  // eslint-disable-next-line no-underscore-dangle, no-console
  page.on('console', consoleObj => console.log(consoleObj._text));

  for (const criteria of rubric.values()) {
    criteria.points = await criteria.grade(page, url);
    if (criteria.points === 0 && criteria.terminateOnFail) {
      break;
    }
  }
  process.stdout.write(rubricToJSON(rubric));
  browser.close();
};

module.exports = {
  rubricToJSON,
  countElementsCriteria,
  newCriteria,
  checkDashURL,
  gradeProject,
};
