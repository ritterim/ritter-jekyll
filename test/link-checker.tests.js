import test from 'ava';
import path from 'path';

import LinkChecker from '../src/lib/link-checker';

test('validate should resolve promise no files', t => {
  t.notThrows(() => new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/**.not-md')));
});

test('validate should resolve promise for no links', t => {
  t.notThrows(() => new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-valid-post-url.md')));
});

test('validate should resolve promise for valid links', t => {
  t.notThrows(() => new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-valid-links.md')));
});

test('validate should reject promise for invalid links', t => {
  return new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-invalid-links.md'))
    .catch(() => {
      t.pass();
    });
});
