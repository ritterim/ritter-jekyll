import test from 'ava';
import path from 'path';

import PostContentValidator from '../src/lib/post-content-validator';

test('validate should not throw for no files', t => {
  t.notThrows(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/**.not-md')));
});

test('validate should throw for `|` link issues', t => {
  const error = t.throws(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-problematic-vertical-bar-links*.md')));

  t.true(error.message.includes(`2000-01-01-post-with-problematic-vertical-bar-links-1.md contains the following problematic vertical bar links:

[abc](https://example.org "A | B")
[def](https://example.org "C | D")`));

  t.true(error.message.includes(`2000-01-01-post-with-problematic-vertical-bar-links-2.md contains the following problematic vertical bar links:

[ghi](https://example.org "G | H")
[jkl](https://example.org "I | J")`));
});

test('validate should not throw for valid links', t => {
  t.notThrows(() => new PostContentValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-valid-links.md')));
});
