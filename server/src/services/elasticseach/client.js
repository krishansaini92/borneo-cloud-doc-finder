const elasticsearch = require('@elastic/elasticsearch');
const esConfig = require('config').get('elasticsearch');

const client = new elasticsearch.Client({
  node: `http://${esConfig.get('host')}:${esConfig.get('port')}`
});

module.exports = client;