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

${fixturesPath}/2000-01-01-post-with-problematic-vertical-bar-links-2.md contains the following problematic vertical bar links:

[ghi](https://example.org "G | H")
[jkl](https://example.org "I | J")`);
});

test('validate should not throw for valid links', () => {
  expect(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-valid-links.md'))).not.toThrow();
});
