'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User.model');

/* ========== ADD TO A USER'S TEAM ========== */
router.put('/add', (req, res, next) => {

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
router.put('/remove', (req, res, next) => {

  const { id, playerID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`Request path id: (${id}) doesn't exist.`);
    err.status = 400;
    return next(err);
  }


  User.findByIdAndUpdate({ _id: id }, {$pull: {team: {playerID: playerID }} }, { new: true })
    .then(user => {
      res.json(user);
    })
    .catch(next);
});

module.exports = router;