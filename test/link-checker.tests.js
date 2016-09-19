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

test('should log warning for HTTP links', t => {
  const winston = require('winston');
  require('winston-memory').Memory;

  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Memory)()
    ]
  });

  return new LinkChecker(logger)
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-non-https-links.md'))
    .then(() => {
      const writeOutput = logger.transports.memory.writeOutput;
      const errorOutput = logger.transports.memory.errorOutput;

      t.is(writeOutput.length, 2);
      t.is(errorOutput.length, 0);

      t.is(writeOutput.filter(x => x.match(/warn: Consider using HTTPS for http:/g)).length, 2);
    });
});

test('should not log warning for HTTPS links', t => {
  const winston = require('winston');
  require('winston-memory').Memory;

  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Memory)()
    ]
  });

  return new LinkChecker(winston)
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-valid-links.md'))
    .then(() => {
      const writeOutput = logger.transports.memory.writeOutput;
      const errorOutput = logger.transports.memory.errorOutput;

      t.is(writeOutput.length, 0);
      t.is(errorOutput.length, 0);
    });
});
