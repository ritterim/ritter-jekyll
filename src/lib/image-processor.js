import imagemin from 'imagemin';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';
import winston from 'winston';

export default class ImageProcessor {
  run(path) {
    return imagemin([`${path}/*`], path, {
      plugins: [
        imageminJpegRecompress(),
        imageminJpegtran(),
        imageminGifsicle(),
        imageminOptipng(),
        imageminSvgo()
      ]
    }).then(files => {
      winston.info(files.map(x => x.path).join('\n'));
    });
  }
}
