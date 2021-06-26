const { S3 } = require('aws-sdk');
const fs = require('fs');
const {
  s3: { bucketName }
} = require('config');
const s3Cloud = new S3();
const util = require('util');
const listObjectsSync = util.promisify(s3Cloud.listObjects);

const opts = {
  Bucket: bucketName
};

async function* listAllKeys(opts) {
  opts = { ...opts };
  do {
    const data = await s3Cloud.listObjectsV2(opts).promise();
    opts.ContinuationToken = data.NextContinuationToken;
    yield data;
  } while (opts.ContinuationToken);
}

const listS3Files = async () => {
  const params = {
    Bucket: bucketName
  };

  return new Promise((res, rej) => {
    s3Cloud.listObjects(params, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data.Contents);
      }
    });
  });
};

const downloadFile = async (fileName, newFilePath) => {
  const params = { Bucket: bucketName, Key: fileName };

  if (!fs.existsSync(newFilePath)) {
    fs.mkdirSync(newFilePath);
  }

  const file = fs.createWriteStream(`${newFilePath}/${fileName}`);

  return new Promise((resolve, reject) => {
    const pipe = s3Cloud
      .getObject(params)
      .createReadStream()
      .pipe(file);
    pipe.on('error', reject);
    pipe.on('close', resolve);
  });
};

module.exports = {
  listFiles: listS3Files,
  downloadFile: downloadFile
};
