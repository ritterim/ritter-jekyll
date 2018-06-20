#! /usr/bin/env node

import path from 'path';
import winston from 'winston';

const winstonTimerLevel = 'info';

require('winston-timer')(winston, {
  level: winstonTimerLevel,
  use_colors: false
});

import PostContentValidator from './post-content-validator';
import PostUrlValidator from './post-url-validator';

const postsGlob = path.join(process.cwd(), '**/_posts/*');

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

function runWithTimings(msg, fn) {
  winston.start_log(msg);
  fn();
  winston.stop_log(msg, winstonTimerLevel);
}
