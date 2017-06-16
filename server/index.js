'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
var router = express.Router();

const PORT = process.env.PORT || 9000;

/*
LOG HTTP Requests
*/
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

/*
Serving static assets build from running 'npm run build'
*/
app.use(express.static(path.resolve(__dirname, '..', 'build')));

/*
Serving based on routes defined in src/routes.js
*/
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

/*
Listening on defined PORT
*/
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});