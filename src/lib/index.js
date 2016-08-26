#! /usr/bin/env node

import path from 'path';
import PostUrlValidator from './post-url-validator';
import RecompressJpegs from './recompress-jpegs';
import npmRun from 'npm-run';

console.log(`ritter-jekyll ${require('../package.json').version}`);

console.log('\n--------------------------------------------------\n');

console.log('Validating post urls...\n');
new PostUrlValidator().validate('_posts/*.md');
console.log('urls are valid!');

console.log('\n--------------------------------------------------\n');

console.log('Running JPEG recompression...\n');
new RecompressJpegs().run('_site/**/*.jpg');

console.log('\n--------------------------------------------------\n');

console.log('Running imagemin-cli...\n');
const imagemin = npmRun.execSync('imagemin _site/images/* -out-dir=_site/images');
console.log(imagemin.toString());

if (process.env.NODE_ENV !== 'production') {
  console.log('\n--------------------------------------------------\n');

  console.log('Running markdown-proofing...\n');
  const configurationPath = path.resolve(__dirname, './markdown-proofing-configuration.json');
  const filesGlob = path.join(process.cwd(), '**/_posts/*.+(md|markdown)');
  const markdownProofing = npmRun.execSync(
    `markdown-proofing -c "${configurationPath}" "${filesGlob}"`);
  console.log(markdownProofing.toString());
}
