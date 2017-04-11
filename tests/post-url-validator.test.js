import path from 'path';

import PostUrlValidator from '../src/lib/post-url-validator';

test('validate should not throw for no files', () => {
  expect(() => new PostUrlValidator()
    .validate(path.resolve(__dirname, './fixtures/**.not-md'))).not.toThrow();
});

test('validate should throw for invalid', () => {
  expect(() => new PostUrlValidator()
    .validate(path.resolve(__dirname, './fixtures/**/*.md'))).toThrow();
});

test('validate should not throw for valid values', () => {
  expect(() => new PostUrlValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-valid-post-url.md'))).not.toThrow();
});
