'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/User.model');


/* ========== CREATE A USER ========== */
router.post('/', (req, res, next) => {

  /* ===== verify all required props are present ===== */
  const requiredProps = ['email', 'username', 'password', 'teamName'];
  const missingProp = requiredProps.find(prop => !(prop in req.body));

  if (missingProp) {
    const err = new Error(`Please fill out the '${missingProp}' section.`);
    err.status = 422;
    return next(err);
  }

  /* ===== verify that the un/pw don't have whitespace ===== */
  const trimmedProps = ['email', 'username', 'password', 'teamName'];
  const nonTrimmedProp = trimmedProps.find(prop => req.body[prop].trim() !== req.body[prop]
  );

  if (nonTrimmedProp) {
    const err = new Error(`Your '${nonTrimmedProp}' cannot begin or end with whitespace`);
    err.status = 422;
    return next(err);
  }

  /* ===== verify that the length of the un/pw meet the requirements ===== */
  const propLengths = {
    username: { min: 2 },
    password: { min: 6, max: 72 }
  };

  const tooShort = Object.keys(propLengths).find(
    prop =>
      'min' in propLengths[prop] &&
      req.body[prop].trim().length < propLengths[prop].min
  );

  const tooLong = Object.keys(propLengths).find(
    prop =>
      'max' in propLengths[prop] &&
      req.body[prop].trim().length > propLengths[prop].max
  );

  if (tooShort) {
    const min = propLengths[tooShort].min;
    const err = new Error(`The '${tooShort}' must be at least ${min} characters long`);
    err.status = 422;
    return next(err);
  }

  if (tooLong) {
    const max = propLengths[tooLong].max;
    const err = new Error(`The '${tooLong}' can't exceed ${max} characters long`);
    err.status = 422;
    return next(err);
  }


  let { fullName = '', username, email, password, teamName } = req.body;
  fullName = fullName.trim();

  User.find({ username })
    .count()
    .then(count => {
      if (count.length) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hashedPW =>
      User.create({
        fullName,
        username,
        email,
        password: hashedPW,
        teamName
      })
    )
    .then(user => res.status(201).location(`${req.originalUrl}/${user.id}`).json(user.return()))
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });

});

module.exports = router;