import glob from 'glob';
import jpegRecompress from 'jpeg-recompress-bin';
const execFileSync = require('child_process').execFileSync;

export default class RecompressJpegs {
  run(path) {
    const files = glob.sync(path, {});

    files.forEach(function(file) {
      console.log(file);
      execFileSync(jpegRecompress, [file, file]);
    });

    console.log(`\n${files.length} file${files.length === 1 ? '' : 's'} processed.`)
  }
}
