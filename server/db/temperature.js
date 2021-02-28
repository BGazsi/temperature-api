/* eslint-disable no-console */

require('dotenv').config();
const Cloudant = require('@cloudant/cloudant');
const apiController = require('../controllers/api-controller');

const cloudant = new Cloudant({
  url: process.env.cloudant_url,
  plugins: [
    {
      iamauth: {
        iamApiKey: process.env.iam_api_key,
      },
    },
  ],
});

const dbClient = cloudant.use('temperatures');

const getAllTemps = () => new Promise((resolve, reject) => {
  dbClient.list({ include_docs: true })
    .then((res) => {
      resolve(res.rows.map((row) => ({
        temp: row.doc.temp,
        humidity: row.doc.humidity,
        timestamp: row.id,
      })));
    })
    .catch((err) => reject(err));
});

cloudant.db.follow('temperatures', {
  include_docs: true,
  since: 'now',
}, (err, changes) => {
  if (err) {
    console.error(err);
    return;
  }
  apiController.sendDataToAllClient({
    temp: changes.doc.temp,
    humidity: changes.doc.humidity,
    // eslint-disable-next-line no-underscore-dangle
    timestamp: changes.doc._id,
  });
});

module.exports = {
  getAllTemps,
};
