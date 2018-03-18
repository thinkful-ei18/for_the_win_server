'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { JWT_EXPIRY, JWT_SECRET } = require('../config.js');

const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);

router.post('/', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});


function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = router;

/**
 Resources:
 https://github.com/auth0/node-jsonwebtoken
 */