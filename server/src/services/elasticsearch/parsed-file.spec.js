const { describe, it, before, after, beforeEach } = require('mocha');
const chai = require('chai');
const chance = require('chance').Chance();
const chaiAsPromised = require('chai-as-promised');
const logger = require('../logger');
const client = require('./client');
const ParseFileIndex = require('./parse-file');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('EsIndex: ParseFileIndex', () => {
  let parseFileIndex;
  before(async () => {
    parseFileIndex = new ParseFileIndex({
      client,
      logger,
      index: 'test-parsed-file',
      forceRefresh: true
    });

    await parseFileIndex.ensureIndex();
  });
  beforeEach(async () => {
    await parseFileIndex.deleteAll();
  });
  after(async () => {
    await parseFileIndex.deleteAll();
  });

  describe('.upsert', () => {
    it('should add new parsed-file', async () => {});
  });

  describe('.filter', () => {
    beforeEach(async () => {
      await parseFileIndex.deleteAll();
    });

    it('should return parsed file having partially matching words in text', async () => {});

    it('should return parsed file having exact matching words in text', async () => {});
  });

  describe('.delete', () => {
    it('should delete parsed file from index', async () => {});
  });
});
