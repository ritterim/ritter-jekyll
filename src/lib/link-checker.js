import brokenLinkChecker from 'broken-link-checker';
import fs from 'fs';
import globby from 'globby';
import markdownLinkExtractor from 'markdown-link-extractor';

export default class LinkChecker {
  validate(path) {
    const files = globby.sync(path);
    let links = [];

    // Get links from files
    files.forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      const textLinks = markdownLinkExtractor(text);

      links.push(...textLinks);
    });

    // Get distinct links, normalizing to lowercase
    links = Array.from(new Set(links.map(link => link.toLowerCase())));

    if (links.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const results = [];

      const urlChecker = new brokenLinkChecker.UrlChecker({ }, {
        link: (result) => {
          results.push(result);

          if (results.length === links.length) {
            if (results.some(result => result.broken)) {
              reject(results);
            } else {
              resolve(results);
            }
          }
        }
      });

      links.forEach(link => {
        urlChecker.enqueue(link);
      });
    });
  }
}
