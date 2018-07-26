const puppeteer = require('puppeteer');

const argv = process.argv.slice(2);

function newCriteria(title, pointsPossible, gradingFunction) {
  const thisCriteria = {
    pointsPossible,
    points: 0,
    title,
    grade: gradingFunction,
  };
  return thisCriteria;
}

const gradingRubric = {
  siteIsUp: newCriteria('The URL is valid and site is up', 10, async (page) => {
    if (argv.length !== 1) {
      // Invalid URL
      console.log('wrong number of arguments');
      return 0;
    }
    const url = argv[0];
    if (url.startsWith('https://dash.generalassemb.ly/') === false) {
      // Invalid URL
      console.log('bad url prefix');
      return 0;
    }
    if (url.endsWith('build-your-own-personal-website') === false) {
      console.log('bad url ending');
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
  }),
  inputFieldsHaveRightStyle: newCriteria('The input fields have size 18px font', 10, async (page) => {
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
  }),
};

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.on('console', consoleObj => console.log(consoleObj._text));
  await page.goto('https://www.google.com/', {
    waitUntil: 'networkidle2',
  });

  gradingRubric.siteIsUp.points = await gradingRubric.siteIsUp.grade(page);
  gradingRubric.inputFieldsHaveRightStyle.points = await gradingRubric.inputFieldsHaveRightStyle.grade(page);
  console.log(argv);
  console.log('woooot');
  console.log(JSON.stringify(gradingRubric));
  browser.close();
})();