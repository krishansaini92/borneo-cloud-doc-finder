const express = require('express');
const ElasticsearchServiceFactory = require('../../services/elasticsearch');

const router = express.Router();

router.get('/search', async ({ requestId, query }, res, next) => {
  try {
    console.log('query: ', query);

    if (!query || !query.text) {
      throw new Error('Please provide search text');
    }

    const { parsedFile: parsedFileIndex } = ElasticsearchServiceFactory({ requestId });

    const matchingFiles = await parsedFileIndex.search({
      search: query.text
    });

    res.send({
      statusCode: 200,
      data: matchingFiles,
      message: 'Files have been fetched'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
