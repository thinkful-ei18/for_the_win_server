'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const User = require('../models/User.model');

const options = { session: false, failWithError: true };
const jwtAuth = passport.authenticate('jwt', options);


/* ========== RETRIEVE A USER'S TEAM ========== */
router.get('/', jwtAuth, (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId)
    .then(user => {
      res.json(user.team);
    })
    .catch(next);
});


/* ========== ADD TO A USER'S TEAM ========== */
router.put('/add', jwtAuth, (req, res, next) => {
  
  const userId = req.user.id;
  const { id, player } = req.body;

  console.log('UID: ', userId);
  console.log('ID: ', id);
  console.log('PLAYER: ', player);


  User.findByIdAndUpdate({ _id: userId }, { $push: {team: player}}, { new: true })
    .then(user => {
      console.log('USER: ', user);
      res.json(user);
    })
    .catch(next);
});


/* ========== REMOVE FROM A USER'S TEAM ========== */
router.put('/remove', jwtAuth, (req, res, next) => {

  const userId = req.user.id;
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