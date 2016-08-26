# ritter-jekyll

[![npm](https://img.shields.io/npm/v/ritter-jekyll.svg)](https://www.npmjs.com/package/ritter-jekyll)

The Ritter Jekyll Experience

## Features

- Process images for all compiled *_site* assets
  - Recompress JPEG images using [jpeg-recompress-bin](https://www.npmjs.com/package/jpeg-recompress-bin)
  - Run [imagemin](https://www.npmjs.com/package/imagemin)
- Validate post urls

## Usage

- Install the package with `npm install ritter-jekyll`, supplying `--save` or `--save-dev` flags as necessary.
- If no `package.json` exists, create one with `npm init`.
- Then, wire `ritter-jekyll` up in `package.json`. For example:

```json
"scripts": {
  "ritter-jekyll": "ritter-jekyll"
}
```

- Now, run with `npm run ritter-jekyll`.

You may want to include this in build and deployment scripts, as necessary.

## Author

Ritter Insurance Marketing https://www.ritterim.com

## License

- **MIT** : http://opensource.org/licenses/MIT

## Contributing

We may accept contributions. However, this package primarily serves the usage strategies of Ritter Insurance Marketing. Please keep that in mind with any potential contributions.
