#! /usr/bin/env node

import path from 'path';
import npmRun from 'npm-run';
import winston from 'winston';

const winstonTimerLevel = 'info';

require('winston-timer')(winston, {
  level: winstonTimerLevel,
  use_colors: false
});

import PostContentValidator from './post-content-validator';
import PostUrlValidator from './post-url-validator';
import ImageProcessor from './image-processor';

const postsGlob = path.join(process.cwd(), '**/_posts/*.+(md|markdown)');
const _siteFolder = path.join(process.cwd(), '/_site');

process.on('unhandledRejection', (reason) => {
  throw reason;
});

winston.info(`ritter-jekyll ${require('../package.json').version}`);

runWithTimings('Validating post urls', () => {
  new PostUrlValidator().validate(postsGlob);
});

runWithTimings('Validating post contents', () => {
  new PostContentValidator().validate(postsGlob);
});

winston.start_log('Running image processor');
new ImageProcessor().run(`${_siteFolder}/images`)
  .then(() => {
    winston.stop_log('Running image processor', winstonTimerLevel);
  })
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      runWithTimings('Running markdown-proofing', () => {
        const configurationPath = path.resolve(__dirname, './markdown-proofing-configuration.json');
        const markdownProofing = npmRun.execSync(
          `markdown-proofing -c "${configurationPath}" "${postsGlob}"`);
        winston.info(markdownProofing.toString());
      });
    }
});

function runWithTimings(msg, fn) {
  winston.start_log(msg);
  fn();
  winston.stop_log(msg, winstonTimerLevel);
}
