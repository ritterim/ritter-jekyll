#! /usr/bin/env node

import path from 'path';
import npmRun from 'npm-run';
import PostUrlValidator from './post-url-validator';
import ImageProcessor from './image-processor';
import LinkChecker from './link-checker';

const postsGlob = path.join(process.cwd(), '**/_posts/*.+(md|markdown)');
const _siteFolder = path.join(process.cwd(), '/_site');

process.on('unhandledRejection', (reason) => {
  throw reason;
});

console.log(`ritter-jekyll ${require('../package.json').version}`);

console.log('\n--------------------------------------------------\n');

console.log('Validating post urls...\n');
new PostUrlValidator().validate(postsGlob);
console.log('urls are valid!');

console.log('\n--------------------------------------------------\n');

console.log('Running link checker...\n');
new LinkChecker().validate(postsGlob)
  .then(linkCheckerRes => {
    console.log(`${linkCheckerRes.length} ${linkCheckerRes.length === 1 ? 'link is' : 'links are'} valid!`);

    console.log('\n--------------------------------------------------\n');

    console.log('Running image processor...\n');
    new ImageProcessor().run(`${_siteFolder}/images`).then(() => {

      if (process.env.NODE_ENV !== 'production') {
        console.log('\n--------------------------------------------------\n');

        console.log('Running markdown-proofing...\n');
        const configurationPath = path.resolve(__dirname, './markdown-proofing-configuration.json');
        const markdownProofing = npmRun.execSync(
          `markdown-proofing -c "${configurationPath}" "${postsGlob}"`);
        console.log(markdownProofing.toString());
      }
    });
  })
  .catch(err => {
    const errors = err
      .filter(e => e.broken)
      .map(e => `${e.brokenReason}: ${e.url.original}`);

    throw new Error(`${errors.length} broken link issue${errors.length === 1 ? '' : 's'}:\n\n`
      + errors.join('\n')
      + '\n');
  });
