require('dotenv').config();
const Cloudant = require('@cloudant/cloudant');

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

module.exports = {
  getAllTemps,
};
