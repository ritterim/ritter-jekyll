#! /usr/bin/env node

import RecompressJpegs from './recompress-jpegs';
import npmRun from 'npm-run';

console.log(`ritter-jekyll ${require('../package.json').version}`);

console.log('\n--------------------------------------------------\n');

console.log('Running JPEG recompression...\n');
new RecompressJpegs().run('_site/**/*.jpg');

console.log('\n--------------------------------------------------\n');

console.log('Running imagemin-cli...\n');
const imagemin = npmRun.execSync('npm run imagemin-site-images');
console.log(imagemin.toString());
