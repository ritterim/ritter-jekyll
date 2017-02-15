import globby from 'globby';
import imagemin from 'imagemin';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import winston from 'winston';

export default class ImageProcessor {
  constructor() {
    this.plugins = [
      imageminJpegRecompress(),
      imageminJpegtran(),
      imageminGifsicle(),
      imageminOptipng(),
      imageminSvgo()
    ];
  }

  run(path) {
    const allFolders = globby.sync(`${path}/**/`); // Trailing slash matches directories only

    const allFoldersPromises = allFolders.map(folder => {
      return imagemin([`${folder}/*`], folder, { plugins: this.plugins }).then(files => {
        winston.info('\n' + files.map(x => x.path).join('\n'));
      });
    })

    return Promise.all(allFoldersPromises);
  }
}
