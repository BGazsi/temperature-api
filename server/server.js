/* eslint-disable no-console */
// import dependencies and initialize express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const whiteList = ['https://bgazsi.github.io', 'http://localhost:3001'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const healthRoutes = require('./routes/health-route');
const swaggerRoutes = require('./routes/swagger-route');
const apiRoutes = require('./routes/api-route');

const app = express();

// enable parsing of http request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

// routes and api calls
app.use('/health', healthRoutes);
app.use('/swagger', swaggerRoutes);
app.use('/api', apiRoutes);

// default path to serve up index.html (single page application)
app.all('', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public', 'index.html'));
});

// start node server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App UI available http://localhost:${port}`);
  console.log(`Swagger UI available http://localhost:${port}/swagger/api-docs`);
});

// error handler for unmatched routes or api calls
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', '404.html'));
  next();
});

module.exports = app;
