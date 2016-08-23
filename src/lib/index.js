import RecompressJpegs from './recompress-jpegs';
import ImageMinifier from './image-minifier';

console.log('Running JPEG recompression...\n');
new RecompressJpegs().run('_site/**/*.jpg');

console.log('\n--------------------------------------------------\n');

console.log('Running image minifier...\n');
new ImageMinifier().run('_site');
