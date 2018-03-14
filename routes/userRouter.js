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


/* ========== ADD TO A USER'S TEAM ========== */
router.put('/draft', (req, res, next) => {

  const { id, player } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`Request path id: (${id}) doesn't exist.`);
    err.status = 400;
    return next(err);
  }

  User.findByIdAndUpdate({ _id: id }, { $push: {team: player}}, { new: true })
    .then(user => {
      res.json(user);
    })
    .catch(next);
});


/* ========== REMOVE FROM A USER'S TEAM ========== */
router.put('/draft/remove', (req, res, next) => {

  const { id } = req.body;
  const { playerID } = req.body;

  User.findByIdAndUpdate({ _id: id }, {$pull: {team: {playerID: playerID }} }, { new: true })
    .then(user => {
      res.json(user);
    })
    .catch(next);
});

module.exports = router;