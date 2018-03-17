'use strict';

/* ===== required library's/files ===== */
const express = require('express'); // node.js web application framework
const cors = require('cors'); // allows the client and server to speak to each other
const morgan = require('morgan'); // HTTP request logger middleware for node.js
const dotenv = require('dotenv').config(); // allows the .env variables to be read by the config file
const passport = require('passport'); // authentication middleware

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
const localStrategy = require('./passport/localStrategy'); // strategy for authenticating with a un and pw.
const jwtStrategy = require('./passport/jwtStrategy'); // strategy for authenticating with jwt's.

const registerRouter = require('./routes/registerRouter');
const teamRouter = require('./routes/teamRouter');
const proxyRouter = require('./routes/proxyRouter');
const authRouter = require('./routes/authRouter');


/* ===== use express ===== */
const app = express();


/* ===== how to use morgan based upon the current environment ===== */
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

/* ===== allow the clients domain to access the server info ===== */
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

/* ===== built in express middleware for decoding the request body ===== */
app.use(express.json());

/* ===== middleware for authenticating with passport ===== */
passport.use(localStrategy);
passport.use(jwtStrategy);


/* ===== endpoints that don't need authorization ===== */
app.use('/register', registerRouter);
app.use('/authorize', authRouter);

/* ===== define authorization to be used with all endpoint below this point===== */
app.use(passport.authenticate('jwt', { session: false, failWithError: true }));

/* ===== endpoints that need authorization ===== */
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


/**
 Resources:
 - express: http://expressjs.com/en/api.html
 - morgan: https://github.com/expressjs/morgan
 - passport: http://www.passportjs.org/
 - passport.authenticate: https://github.com/themikenicholson/passport-jwt

 */