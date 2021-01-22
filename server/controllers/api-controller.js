const tempDb = require('../db/temperature');

exports.getTemps = (req, res) => {
  tempDb.getAllTemps().then((rows) => {
    res.json({
      temperatureData: rows.sort((row1, row2) => row1.timestamp - row2.timestamp),
    });
  }).catch((err) => {
    res.status(500);
    res.json({
      error: err.message || err,
    });
  });
};