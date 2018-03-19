'use strict';

const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/User.model');


const localStrategy = new LocalStrategy(
  { usernameField: 'email', passwordField: 'password',},
  (email, password, done) => {
    let user;
    User.findOne({ email })
      .then(result => {
        user = result;
        if (!user) {
          return Promise.reject({
            reason: 'LoginError',
            message: 'Incorrect username',
            location: 'username',
            status: 401
          });
        }
        return user.validatePassword(password);
      })
      .then(validatedPW => {
        if (!validatedPW) {
          return Promise.reject({
            reason: 'LoginError',
            message: 'Incorrect password',
            location: 'password',
            status: 401
          });
        }
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      });
  });

module.exports = localStrategy;

/**
 Resources:
 https://github.com/jaredhanson/passport-local
 http://www.passportjs.org/docs/username-password/
 */