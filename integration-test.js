const npmRun = require('npm-run');
const shellJs = require('shelljs');

const packageVersion = require('./package.json').version;

shellJs.exec('npm run build');
shellJs.exec('npm pack');
shellJs.pushd('./jekyll-site');
shellJs.exec(`npm install ../ritter-jekyll-${packageVersion}.tgz`);
shellJs.rm('../ritter-jekyll-*.tgz');

shellJs.exec('npm run ritter-jekyll-for-testing');

shellJs.rm('-rf', './node_modules');
shellJs.popd();
