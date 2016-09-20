import brokenLinkChecker from 'broken-link-checker';
import fs from 'fs';
import globby from 'globby';
import markdownLinkExtractor from 'markdown-link-extractor';

export default class LinkChecker {
  constructor(logger = null) {
    this.logger = logger || require('winston');
  }

  validate(path) {
    const files = globby.sync(path);
    let links = [];

    // Get links from files
    files.forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      const textHttpLinks = markdownLinkExtractor(text)
        .filter(x => /^http/i.test(x));

      links.push(...textHttpLinks);
    });

    // Get distinct links, normalizing to lowercase
    links = Array.from(new Set(links.map(link => link.toLowerCase())));

    if (links.length === 0) {
      return Promise.resolve();
    }

    const brokenLinkCheckerPromise = new Promise((resolve, reject) => {
      const results = [];

      let enqueueErrorsCount = 0;

      const urlChecker = new brokenLinkChecker.UrlChecker({ }, {
        link: (result) => {
          results.push(result);

          if (results.length + enqueueErrorsCount === links.length) {
            if (results.some(x => x.broken)) {
              reject(results);
            } else {
              resolve(results);
            }
          }
        }
      });

      links.forEach(link => {
        const enqueueResult = urlChecker.enqueue(link);

        if (enqueueResult instanceof Error) {
          enqueueErrorsCount++;
        }
      });
    });

    const nonSecureLinkCheckerPromise = new Promise((resolve) => {
      const results = [];

      const nonSecureLinks = links.filter(link => /^http:/i.test(link));

      if (nonSecureLinks.length === 0) {
        resolve();
      }

      let enqueueErrorsCount = 0;

      const urlChecker = new brokenLinkChecker.UrlChecker({ }, {
        link: (result) => {
          results.push(result);

          if (results.length + enqueueErrorsCount === nonSecureLinks.length) {
            results
              .filter(x => !x.broken)
              .forEach(x => {
                const originalHttpLink = x.url.original.replace(/^https:/i, 'http:');

                this.logger.warn(`Consider using HTTPS for ${originalHttpLink}`);
              });

            resolve(results);
          }
        }
      });

      nonSecureLinks.forEach(link => {
        const httpsLink = link.replace(/^http:/i, 'https:');
        const enqueueResult = urlChecker.enqueue(httpsLink);

        if (enqueueResult instanceof Error) {
          enqueueErrorsCount++;
        }
      });
    });

    return Promise.all([
      nonSecureLinkCheckerPromise,
      brokenLinkCheckerPromise
    ]);
  }
}
