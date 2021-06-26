const EsIndex = require('./es-index');

const defaultIndex = 'parsedfile';

const defaultMapping = {
  text: {
    type: 'text'
  },
  updatedAt: {
    type: 'date'
  },
  fileName: {
    type: 'text'
  }
};

class ParsedFile extends EsIndex {
  constructor({ index = defaultIndex, mappings = defaultMapping, ...args }) {
    super({ ...args, index, mappings });
  }

  async upsert(parsedFileObj) {

    const parsedFile = {
      id: parsedFileObj.id,
      fileName: parsedFileObj.name,
      text: parsedFileObj.text,
      updatedAt: parsedFileObj.updatedAt
    };
    const logMsgPostfix = `parsedFileId "${parsedFile.id}"`;
    this.logger.info(`Upserting ${logMsgPostfix}`);

    const response = this.client
      .index({
        index: this.index,
        id: String(parsedFile.id),
        refresh: this.forceRefresh,
        body: parsedFile
      })
      .catch((err) => {
        this.logger.error(`Failed to upsert ${logMsgPostfix}`, {
          errorMessage: err.message,
          error: err
        });

        throw err;
      });

    this.logger
      .info(`Updated ${logMsgPostfix}`)
      .debug(`Response Upserting ${logMsgPostfix}`, response);

    return response;
  }

  async delete(parsedFile) {
    const response = await super.delete(parsedFile);

    return response;
  }

  async search(filter, from = 0, size = 1000) {
    const search = filter && filter.search;
    const name = filter && filter.name;

    const query = {
      bool: {
        must: []
      }
    };

    if (name) {
      query.bool.must.push({
        term: {
          fileName: name
        }
      });
    }

    if (search) {
      const searchWords = search
        .trim()
        .toLowerCase()
        .split(/[\.\-_ ]/);

      searchWords.forEach((searchWord) => {
        query.bool.must.push({
          bool: {
            should: [
              {
                wildcard: {
                  text: {
                    value: `*${searchWord}*`,
                    boost: 1.0,
                    rewrite: "constant_score"
                  }
                }
              },
              {
                wildcard: {
                  fileName: {
                    value: `*${searchWord}*`,
                    boost: 1.0,
                    rewrite: "constant_score"
                  }
                }
              }
            ]
          }
        });
      });
    }
    console.log(JSON.stringify(query));
    const sort = { updatedAt: 'desc' };
    const result = await this.client.search({
      index: this.index,
      body: {
        query,
        sort: [sort],
        from,
        size
      }
    });
    // this.logger.debug('ES result', { from, size, result });
    const parsedFiles = result.body.hits.hits;

    return {
      total: result.body.hits.total.value,
      parsedFiles
    };
  }
}

module.exports = ParsedFile;
