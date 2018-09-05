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
gradingRubric.set('siteIsUp', newCriteria('The URL is valid and site is up', 10, true, checkDashURL('build-your-own-blog-theme')));
gradingRubric.set('hasJeffImage', countElementsCriteria('There one image of Jeff', 10, false, 1, 'img[src$="jeff.png"]'));
gradingRubric.set('hasLikeButtons', countElementsCriteria('There are three like buttons', 10, false, 3, 'button'));
gradingRubric.set('hasParagraph', countElementsCriteria('There are three paragraphs inside articles', 10, false, 3, 'article p'));


gradingRubric.set('designIsResponsive', newCriteria('The design is responsive', 30, false, async (page) => {
  try {
    const getH1FontSize = async () => { /* eslint-env browser */
      const elements = document.getElementsByTagName('h1');
      if (elements.length < 1) {
        return 0;
      }
      const style = window.getComputedStyle(elements[0]);
      const fontSize = style.getPropertyValue('font-size');
      return fontSize;
    };
    const bigFontSize = await page.evaluate(getH1FontSize);
    await page.setViewport({
      width: 400,
      height: 800,
    });
    const littleFontSize = await page.evaluate(getH1FontSize);
    if (littleFontSize < bigFontSize) {
      return 30;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}));


module.exports = {
  gradeProject2: async (url) => gradeProject(gradingRubric, url),
};
