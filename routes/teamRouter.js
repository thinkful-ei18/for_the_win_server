'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

router.put('/', (req, res, next) => {
  const { id } = req.user;
  const playerID = req.body.playerID;

  User.findByIdAndUpdate({ _id: id }, { $push: {team: playerID}}, { new: true })
    .then(team => res.json(team))
    .catch(next);
});