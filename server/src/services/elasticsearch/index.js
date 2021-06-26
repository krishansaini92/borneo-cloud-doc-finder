const defaultLogger = require('../logger');
const client = require('./client');
const ParseFileIndex = require('./parsed-file');

module.exports = ({ requestId, logger: maybeLogger }) => {
  const logger = maybeLogger || defaultLogger.child({ requestId });

  const parsedFile = new ParseFileIndex({ logger, client });

  return {
    async ensureIndex() {
      await parsedFile.ensureIndex();
    },
    parsedFile
  };
};
