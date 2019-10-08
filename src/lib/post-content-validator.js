import fs from 'fs';
import globby from 'globby';
import frontMatter from 'front-matter';

export default class PostContentValidator {
  validate(path) {
    const errors = [];
    const files = globby.sync(path);

    files.forEach(file => {
      const text = fs.readFileSync(file, 'utf8');

      // Look for problematic styled quotes in links
      // [test]({% post_url 2017-01-01-test %} “test”)
      const styledQuotesLinks = text.match(/\[.*\]\([\w:/.]*[\s|\w]*[“|”].*\)/gi);

      if (styledQuotesLinks) {
        errors.push(file
          + ' contains the following problematic styled quotes links:\n\n'
          + styledQuotesLinks.join('\n')
          + '\n');
      }

      // Ensure post date matches filename date
      const filenameDate = file.match(/\d{4}-\d{2}-\d{2}/)[0];
      const post = frontMatter(text);

      if (post.attributes.date) {
        const postDateMatch = post.attributes.date.match(/^\d{4}-\d{2}-\d{2}/);
        const postDateOnly = postDateMatch ? postDateMatch[0] : null;

        if (postDateOnly && postDateOnly !== filenameDate) {
          errors.push(file
            + ` post date (${postDateOnly})`
            + ` does not match the filename date (${filenameDate}).`);
        }
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }
}
