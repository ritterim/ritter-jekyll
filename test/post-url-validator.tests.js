import test from 'ava';
import path from 'path';

import PostUrlValidator from '../src/lib/post-url-validator';

test('validate should not throw for no files', t => {
  t.notThrows(() => new PostUrlValidator()
    .validate(path.resolve(__dirname, './fixtures/**.not-md')));
});

test('validate should throw for invalid', t => {
  t.throws(() => new PostUrlValidator()
    .validate(path.resolve(__dirname, './fixtures/**/*.md')));
});

test('validate should not throw for valid values', t => {
  t.notThrows(() => new PostUrlValidator()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-valid-post-url.md')));
});
