import path from 'path';

import PostContentValidator from '../src/lib/post-content-validator';

test('validate should not throw for no files', () => {
  expect(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/**.not-md'))).not.toThrow();
});

test('validate should throw for `|` link issues', () => {
  const fixturesPath = __dirname.replace(/\\/g, '/') + '/fixtures';

  expect(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-problematic-vertical-bar-links*.md')))
    .toThrow(`${fixturesPath}/2000-01-01-post-with-problematic-vertical-bar-links-1.md contains the following problematic vertical bar links:

[abc](https://example.org "A | B")
[def](https://example.org "C | D")

Remove them or replace them with &#124;

${fixturesPath}/2000-01-01-post-with-problematic-vertical-bar-links-2.md contains the following problematic vertical bar links:

[ghi](https://example.org "G | H")
[jkl](https://example.org "I | J")

Remove them or replace them with &#124;`);
});

test('validate should not throw for valid links', () => {
  expect(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-valid-links.md'))).not.toThrow();
});

test('validate should throw when post date does not match filename date', () => {
  const fixturesPath = __dirname.replace(/\\/g, '/') + '/fixtures';

  expect(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-non-matching-yaml-date.md')))
    .toThrow(`${fixturesPath}/2000-01-01-post-with-non-matching-yaml-date.md post date (2010-01-01) does not match the filename date (2000-01-01).`);
});

test('validate should not throw when post contains invalid date', () => {
  expect(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-invalid-yaml-date.md'))).not.toThrow();
});
