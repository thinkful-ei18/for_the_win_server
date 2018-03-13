'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User.model');

/* ========== CREATE A USER ========== */
router.post('/', (req, res, next) => {
  const { email, username, password, teamName } = req.body;

  User.create({ email, username, password, teamName })
    .then(user => res.json(user).status(201))
    .catch(next);
});


/* ========== UPDATE A USER'S TEAM ========== */
router.put('/draft', (req, res, next) => {

  const { id, playerID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`Request path id: (${id}) doesn't exist.`);
    err.status = 400;
    return next(err);
  }

  User.findByIdAndUpdate({ _id: id }, { $push: {team: playerID}}, { new: true })
    .then(team => res.json(team))
    .catch(next);
});

module.exports = router;