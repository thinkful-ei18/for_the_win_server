'use strict';

const express = require('express');
const router = express.Router();
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
  const { playerID, firstName, lastName } = req.body;
  const player = { playerID, firstName, lastName };

  User.findByIdAndUpdate({ _id: userId }, { $push: {team: player}}, { new: true })
    .then(user => {
      res.json(user);
    })
    .catch(next);
});


/* ========== REMOVE FROM A USER'S TEAM ========== */
router.put('/remove', jwtAuth, (req, res, next) => {

  const userId = req.user.id;
  const { playerID } = req.body;

  User.findByIdAndUpdate({ _id: userId }, {$pull: {team: {playerID }} }, { new: true })
    .then(user => {
      res.json(user);
    })
    .catch(next);
});


module.exports = router;