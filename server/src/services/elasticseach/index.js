const defaultLogger = require('../logger');
const client = require('./client');
const ParseFileIndex = require('./parse-file');

module.exports = ({ requestId, logger: maybeLogger }) => {
  const logger = maybeLogger || defaultLogger.child({ requestId });

  const parseFile = new ParseFileIndex({ logger, client });

  return {
    async ensureIndex() {
      await parseFile.ensureIndex();
    },
    parseFile
  };
};