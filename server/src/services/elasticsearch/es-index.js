/* eslint no-underscore-dangle: ["error", { "allow": ["_source"] }] */
class EsIndex {
  constructor({ logger, client, index, forceRefresh = false, mappings }) {
    this.forceRefresh = forceRefresh;
    this.logger = logger;
    this.client = client;
    this.index = index;
    this.mappings = mappings;
  }

  async ensureIndex() {
    try {
      this.logger.info('Ensuring index exists', { index: this.index });
      const response = await this.client.indices.create({ index: this.index });

      this.logger.info('Index created:', response);
    } catch (err) {
      if (/resource_already_exists_exception/.test(err.message)) {
        this.logger.info(`Index "${this.index}" already exists`);
      } else {
        this.logger.error('Unable to create/ensure index', err);

        throw err;
      }
    }

    if (this.mappings) {
      try {
        await this.client.indices.putMapping({
          index: this.index,
          body: {
            properties: this.mappings
          }
        });

        this.logger.info(`Added mapping for index ${this.index}`, {
          mapping: this.mappings
        });
      } catch (err) {
        this.logger.error(`Unable to update mapping for index ${this.index}`, err);

        throw err;
      }
    }
  }

  async findById(id) {
    try {
      const doc = await this.client.get({ id: String(id), index: this.index });

      return doc && doc.body && doc.body._source ? { id, ...doc.body._source } : null;
    } catch (err) {
      if (err.meta && err.meta.statusCode && err.meta.statusCode === 404) {
        this.logger.info('Indexed document not found.').debug('Not found response', { error: err });

        return null;
      }

      throw err;
    }
  }

  async deleteIndex() {
    this.logger.debug(`Deleting index "${this.index}"`);
    const response = await this.client.indices.delete({
      index: this.index
    });

    this.logger.info(`Deleted index "${this.index}"`).debug('Delete index response', response);

    return response;
  }

  async delete({ id }) {
    this.logger.debug(`Deleting doc "${id}" from index "${this.index}"`);
    const response = await this.client.delete({
      index: this.index,
      id
    });

    this.logger.info(`Deleted doc "${id}"`).debug('Delete doc response', response);

    return response;
  }

  async deleteAll() {
    this.logger.debug(`Deleting all indexed documents from "${this.index}"`);
    const response = await this.client.deleteByQuery({
      index: this.index,
      conflicts: 'proceed',
      body: { query: { match_all: {} } }
    });

    this.logger
      .info(`Deleted all indexed documents from "${this.index}`)
      .debug('Delete all response', response);

    return response;
  }

  async refresh() {
    return this.client.indices.refresh({ index: this.index });
  }
}

module.exports = EsIndex;
