const express = require('express');
const { listFiles, downloadFile } = require('../../services/cloud-storage');
const { defaultDownloadPath } = require('config');
const { readDocx, readPdf } = require('../../lib/read-files');
const ElasticsearchServiceFactory = require('../../services/elasticsearch');

const router = express.Router();

const sync = async ({ requestId }) => {
  const { parsedFile: parsedFileIndex } = ElasticsearchServiceFactory({ requestId });

  const files = await listFiles();

  console.log('files: ', files);

  for (const file of files) {
    await downloadFile(file.Key, defaultDownloadPath);

    let text = '';

    if (file.Key.indexOf('pdf') > -1) {
      text = await readPdf(`${defaultDownloadPath}/${file.Key}`);
    } else if (file.Key.indexOf('doc') > -1 || file.Key.indexOf('docx') > -1) {
      text = await readDocx(`${defaultDownloadPath}/${file.Key}`);
    } else {
      console.error('Unable to parse file type');
    }

    console.log('text: ', text);

    await parsedFileIndex.upsert({
      id: file.Key,
      updatedAt: file.LastModified,
      text,
      fileName: file.Key
    });
  }
};

router.post('/sync', async ({ requestId }, res, next) => {
  try {
    sync({ requestId });

    res.send({
      statusCode: 200,
      message: 'Sync has been initialized'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
