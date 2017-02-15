#! /usr/bin/env node

import path from 'path';
import npmRun from 'npm-run';
import winston from 'winston';
import PostContentValidator from './post-content-validator';
import PostUrlValidator from './post-url-validator';
import ImageProcessor from './image-processor';
import LinkChecker from './link-checker';

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

    winston.info('Running link checker...');
    new LinkChecker().validate(postsGlob)
      .then(linkCheckerRes => {
        winston.info(`${linkCheckerRes.length} ${linkCheckerRes.length === 1 ? 'link is' : 'links are'} valid!`);
      })
      .catch(err => {
        if (Array.isArray(err)) {
          const errors = err
            .filter(e => e.broken)
            .map(e => `${e.brokenReason}: ${e.url.original}`);

          winston.warn(`${errors.length} broken link issue${errors.length === 1 ? '' : 's'}:\n\n`
            + errors.join('\n')
            + '\n');
        } else {
          winston.warn(err);
        }
      });
  }
});
