// import dependencies and initialize the express router
const express = require('express');
const apiController = require('../controllers/api-controller');

const router = express.Router();

// define routes
router.get('/getTemps', apiController.getTemps);

module.exports = router;
