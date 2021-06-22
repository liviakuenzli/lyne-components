const argv = require('minimist');
const shell = require('shelljs');
const triggerTravis = require('lyne-helper-trigger-travis');

(async () => {
  const token = argv(process.argv.slice(2))['t'];

  try {
    await triggerTravis({
      branchName: 'master',
      message: 'triggered by lyne-components change',
      travisToken: token,
      travisUrl: 'https://api.travis-ci.com/repo/lyne-design-system%2Flyne-hydration-playground/requests'
    });

    console.log('-->> triggered build on lyne-hydration-playground');
    shell.exit(0);
  } catch (error) {
    console.log('-->> error while triggering build on lyne-hydration-playground');
    console.log(error);
    shell.exit(1);
  }

})();
