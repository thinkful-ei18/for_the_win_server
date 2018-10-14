'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User.model');
const League = require('../models/League.model');

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
  const { playerPic, playerID, playerName, playerTeam, playerPosition } = req.body;
  const requestedPlayer = { playerPic, playerID, playerName, playerTeam, playerPosition };

  League.findOne({ 'users.userId': userId })
    .then(league => {
      if (league.players.find(player => player.playerID === requestedPlayer.playerID)) {
        let err = new Error(`${requestedPlayer.playerName} was drafted already in this league; please choose another player.`);
        err.status = 409;
        return next(err);
      }
      else {
        league.players.push(requestedPlayer);
        league.save();
      }
    })
    .then(() => User.findByIdAndUpdate({ _id: userId }, { $push: {team: requestedPlayer}}, { new: true }))
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