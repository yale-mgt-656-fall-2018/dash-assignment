const puppeteer = require('puppeteer');

const argv = process.argv.slice(2);

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

// Use a map so we can iterate over elements in
// insertion order. This is important because we
// might want to terminate early.
const gradingRubric = new Map();
gradingRubric.set('siteIsUp', newCriteria('The URL is valid and site is up', 10, true, async (page) => {
  if (argv.length !== 1) {
    // Invalid URL
    return 0;
  }
  const url = argv[0];
  if (url.startsWith('https://dash.generalassemb.ly/') === false) {
    // Invalid URL
    return 0;
  }
  if (url.endsWith('build-your-own-personal-website') === false) {
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
}));

gradingRubric.set('inputFieldsHaveRightStyle', newCriteria('The input fields have size 18px font', 10, false, async (page) => {
  try {
    const inputFontSize = await page.evaluate(() => { /* eslint-env browser */
      const elements = document.getElementsByTagName('input');
      if (elements.length < 1) {
        return null;
      }
      const style = window.getComputedStyle(elements[0]);
      return style.getPropertyValue('font-size');
    });
    if (inputFontSize === '18px') {
      return 10;
    }
  } catch (error) {
    return 0;
  }
  return 0;
}));

gradingRubric.set('hasSubmitButton', countElementsCriteria('There is one submit button', 10, false, 1, 'input[type="submit"]'));
gradingRubric.set('hasParagraph', countElementsCriteria('There is one paragraph', 10, false, 1, 'p'));
gradingRubric.set('hasAnnaImage', countElementsCriteria('There one image of Anna', 10, false, 1, 'img[src$="anna.png"]'));

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  // Uncomment to see console.log statements in the Chrome client.
  // page.on('console', consoleObj => console.log(consoleObj._text));
  await page.goto('https://www.google.com/', {
    waitUntil: 'networkidle2',
  });

  for (const criteria of gradingRubric.values()) {
    criteria.points = await criteria.grade(page);
    if (criteria.points === 0 && criteria.terminateOnFail) {
      break;
    }
  }
  process.stdout.write(rubricToJSON(gradingRubric));
  browser.close();
})();