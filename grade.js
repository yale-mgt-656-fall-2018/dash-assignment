const {
  gradeProject1,
} = require('./grade-project-1.js');

const argv = process.argv.slice(2);


(async () => {
  if (argv.length !== 2) {
    process.stderr.write('Wrong number of arguments\n');
    return;
  }
  if (argv[0] === 'project-1') {
    gradeProject1(argv[1]);
  }
})();
