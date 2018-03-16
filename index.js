'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv').config(); // allows the .env variables to be read by the config file

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
const registerRouter = require('./routes/registerRouter');
const teamRouter = require('./routes/teamRouter');
const proxyRouter = require('./routes/proxyRouter');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);


/* ===== middleware ===== */
app.use(express.json());


/* ===== routes ===== */
app.use('/register', registerRouter);
app.use('/team', teamRouter);
app.use('/api', proxyRouter);


/* ===== error handling ===== */
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});



function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};
