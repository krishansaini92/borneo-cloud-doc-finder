const pdfParser = require('pdf-parse');
const officeParser = require('officeparser');
const fs = require('fs');

const readPdf = async (pdfFilePath) =>
  new Promise(async (resolve, reject) => {
    fs.readFile(pdfFilePath, async (err, pdfBuffer) => {
      if (err) {
        reject(err);
      } else {
        const pdfText = await pdfParser(pdfBuffer);

        resolve(pdfText.text);
      }
    });
  });

const readDocx = async (filePath) =>
  new Promise(async (resolve, reject) => {
    officeParser.parseOffice(filePath, function(data, err) {
      if (err) return reject(err);
      resolve(data);
    });
  });

module.exports = {
  readPdf,
  readDocx
};
