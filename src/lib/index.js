#! /usr/bin/env node

import path from 'path';
import PostUrlValidator from './post-url-validator';
import RecompressJpegs from './recompress-jpegs';
import npmRun from 'npm-run';

const postsGlob = path.join(process.cwd(), '**/_posts/*.+(md|markdown)');
const _siteFolder = path.join(process.cwd(), '/_site');

console.log(`ritter-jekyll ${require('../package.json').version}`);

console.log('\n--------------------------------------------------\n');

console.log('Validating post urls...\n');
new PostUrlValidator().validate(postsGlob);
console.log('urls are valid!');

console.log('\n--------------------------------------------------\n');

console.log('Running JPEG recompression...\n');
new RecompressJpegs().run(`${_siteFolder}/**/*.jpg`);

console.log('\n--------------------------------------------------\n');

console.log('Running imagemin-cli...\n');
const imagemin = npmRun.execSync(`imagemin ${_siteFolder}/images/* -out-dir=${_siteFolder}/images`);
console.log(imagemin.toString());

if (process.env.NODE_ENV !== 'production') {
  console.log('\n--------------------------------------------------\n');

  console.log('Running markdown-proofing...\n');
  const configurationPath = path.resolve(__dirname, './markdown-proofing-configuration.json');
  const markdownProofing = npmRun.execSync(
    `markdown-proofing -c "${configurationPath}" "${postsGlob}"`);
  console.log(markdownProofing.toString());
}
