import path from 'path';

import LinkChecker from '../src/lib/link-checker';

test('validate should resolve promise no files', () => {
  expect(() => new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/**.not-md'))).not.toThrow();
});

test('validate should resolve promise for no links', () => {
  expect(() => new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-valid-post-url.md'))).not.toThrow();
});

test('validate should resolve promise for valid links', () => {
  expect(() => new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-valid-links.md'))).not.toThrow();
});

test('validate should reject promise for invalid links', () => {
  return new LinkChecker()
    .validate(path.resolve(__dirname, './fixtures/2000-01-01-post-with-invalid-links.md'))
    .catch(() => {});
});

test('should log warning for HTTP links', () => {
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

      expect(writeOutput.length).toBe(2);
      expect(errorOutput.length).toBe(0);

      expect(
        writeOutput.filter(x => x.match(/warn: Consider using HTTPS for http:/g)).length
      ).toBe(2);
    });
});

test('should not log warning for HTTPS links', () => {
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

      expect(writeOutput.length).toBe(0);
      expect(errorOutput.length).toBe(0);
    });
});
