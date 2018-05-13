'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User.model');
const League = require('../models/League.model');

const options = { session: false, failWithError: true };
const jwtAuth = passport.authenticate('jwt', options);

/* ========== RETRIEVE A LEAGUE ========== */
router.get('/', jwtAuth, (req, res, next) => {
  // get userId
  // search users array within each league to see if this user's id is in there
  // if so, return that league
  
});


/* ========== CREATE A LEAGUE ========== */
router.post('/add', jwtAuth, (req, res, next) => {
  
  const userId = req.user.id;
  const { name } = req.body;

  League.find({name})
    .count()
    .then( number => {
      
      if (number.length) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'League already taken',
          location: 'name'
        });
      }

      return League.create({
        name,
        users: [ userId ]
      });
    })
    .then(league => res.status(201).location(`${req.originalUrl}/${league.id}`).json(league) )
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The league already exists');
        err.status = 400;
      }
      next(err);
    });
    
});


/* ========== JOIN A LEAGUE ========== */
router.put('/join', jwtAuth, (req, res, next) => {
  
 
});

module.exports = router;