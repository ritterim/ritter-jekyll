import imagemin from 'imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';

export default class ImageMinifier {
  run(path) {
    imagemin([`${path}/*`], path, {
      plugins: [
        imageminGifsicle(),
        imageminJpegtran(),
        imageminOptipng(),
        imageminSvgo()
      ]
    }).then(files => {
      files.forEach(file => {
        console.log(file.path);
      });

      console.log(`\n${files.length} file${files.length === 1 ? '' : 's'} processed.`);
    }).catch(err => {
      throw err;
    });
  }
}
