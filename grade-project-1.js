const {
  newCriteria,
  countElementsCriteria,
  checkDashURL,
  gradeProject,
} = require('./helpers.js');


// Use a map so we can iterate over elements in
// insertion order. This is important because we
// might want to terminate early.
const gradingRubric = new Map();
gradingRubric.set('siteIsUp', newCriteria('The URL is valid and site is up', 10, true, checkDashURL('build-your-own-personal-website')));

gradingRubric.set('inputFieldsHaveRightStyle', newCriteria('The input fields have size 18px font', 10, false, async (page) => {
  try {
    const inputFontSize = await page.evaluate(() => { /* eslint-env browser */
      const elements = document.getElementsByTagName('input');
      if (elements.length < 1) {
        return 0;
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

module.exports = {
  gradeProject1: async (url) => gradeProject(gradingRubric, url),
};
