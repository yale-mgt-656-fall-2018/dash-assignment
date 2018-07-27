const {
  gradeProject1,
} = require('./grade-project-1.js');
const {
  gradeProject2,
} = require('./grade-project-2.js');

const argv = process.argv.slice(2);


(async () => {
  if (argv.length !== 2) {
    process.stderr.write('Wrong number of arguments\n');
    return;
  }
  if (argv[0] === 'project-1') {
    gradeProject1(argv[1]);
  } else if (argv[0] === 'project-2') {
    gradeProject2(argv[1]);
  }
})();
