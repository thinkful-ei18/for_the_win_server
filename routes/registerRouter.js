'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

/* ========== CREATE A USER ========== */
router.post('/', (req, res, next) => {
  const { email, username, password, teamName } = req.body;

  User.create({ email, username, password, teamName })
    .then(user => res.json(user).status(201))
    .catch(next);
});

module.exports = router;