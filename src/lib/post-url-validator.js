import globby from 'globby';

export default class PostUrlValidator {
  validate(path) {
    const files = globby.sync(path);

    const errors = files.filter(x => !x.match(
      /.*\d{4}-\d{2}-\d{2}-([a-z0-9-])+\.(markdown|md)$/));

    if (errors.length > 0) {
      throw new Error(errors.length.toString()
        + ' post filename'
        + (errors.length > 1 ? 's' : '')
        + ' did not match the expected format:\n\n'
        + errors.join('\n')
        + '\n');
    }
  }
}
