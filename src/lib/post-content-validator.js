import fs from 'fs';
import globby from 'globby';
import frontMatter from 'front-matter';

export default class PostContentValidator {
  validate(path) {
    const errors = [];
    const files = globby.sync(path);

    files.forEach(file => {
      const text = fs.readFileSync(file, 'utf8');

      // Look for problematic `|` character in
      // [abc](https://example.org "A | B")
      const verticalBarProblematicLinks = text.match(/\[.*\]\([\w:\/.]*\s*\".*\|.*\"\)/gi);

      if (verticalBarProblematicLinks) {
        errors.push(file
          + ' contains the following problematic vertical bar links:\n\n'
          + verticalBarProblematicLinks.join('\n')
          + '\n');
      }

      // Ensure post date matches filename date
      const filenameDate = file.match(/\d{4}-\d{2}-\d{2}/)[0];
      const post = frontMatter(text);

      if (post.attributes.date) {
        const postDateOnly = post.attributes.date.match(/^\d{4}-\d{2}-\d{2}/)[0];

        if (postDateOnly !== filenameDate) {
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
