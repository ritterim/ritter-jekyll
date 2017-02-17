#! /usr/bin/env node

import path from 'path';
import npmRun from 'npm-run';
import winston from 'winston';
import PostContentValidator from './post-content-validator';
import PostUrlValidator from './post-url-validator';
import ImageProcessor from './image-processor';

const postsGlob = path.join(process.cwd(), '**/_posts/*.+(md|markdown)');
const _siteFolder = path.join(process.cwd(), '/_site');

process.on('unhandledRejection', (reason) => {
  throw reason;
});

winston.info(`ritter-jekyll ${require('../package.json').version}`);

winston.info('Validating post urls...');
new PostUrlValidator().validate(postsGlob);
winston.info('urls are valid!');

winston.info('Validating post contents...');
new PostContentValidator().validate(postsGlob);
winston.info('post content is valid!');

winston.info('Running image processor...');
new ImageProcessor().run(`${_siteFolder}/images`).then(() => {
  if (process.env.NODE_ENV !== 'production') {
    winston.info('Running markdown-proofing...');
    const configurationPath = path.resolve(__dirname, './markdown-proofing-configuration.json');
    const markdownProofing = npmRun.execSync(
      `markdown-proofing -c "${configurationPath}" "${postsGlob}"`);
    winston.info(markdownProofing.toString());
  }
});
