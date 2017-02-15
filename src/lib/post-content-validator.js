import fs from 'fs';
import globby from 'globby';

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
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }
}
