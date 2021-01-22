const tempDb = require('../db/temperature');

exports.getTemps = (req, res) => {
  tempDb.getAllTemps().then((rows) => {
    res.json({
      temperatureData: rows.sort((row1, row2) => row2.timestamp - row1.timestamp),
    });
  }).catch((err) => {
    res.status(500);
    res.json({
      error: err.message || err,
    });
  });
};
