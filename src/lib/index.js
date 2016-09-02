#! /usr/bin/env node

import path from 'path';
import npmRun from 'npm-run';
import PostUrlValidator from './post-url-validator';
import ImageProcessor from './image-processor';

const postsGlob = path.join(process.cwd(), '**/_posts/*.+(md|markdown)');
const _siteFolder = path.join(process.cwd(), '/_site');

console.log(`ritter-jekyll ${require('../package.json').version}`);

console.log('\n--------------------------------------------------\n');

console.log('Validating post urls...\n');
new PostUrlValidator().validate(postsGlob);
console.log('urls are valid!');

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
