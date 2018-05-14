'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

const League = require('../models/League.model');

const options = { session: false, failWithError: true };
const jwtAuth = passport.authenticate('jwt', options);

/* ========== RETRIEVE ALL LEAGUES ========== */
router.get('/', jwtAuth, (req, res, next) => {

  League.find({})
    .then( league => res.json(league))
    .catch(err => next(err));
  
});


/* ========== CREATE A LEAGUE ========== */
router.post('/add', jwtAuth, (req, res, next) => {
  
  const userId = req.user.id;
  const { name } = req.body;

  League.find({name})
    .count()
    .then( number => {
      if (number >= 1) {
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
    .then(league => {
      return res.status(201).location(`${req.originalUrl}/${league.id}`).json(league);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error(`'${name}' already exists`);
        err.status = 400;
      }
      next(err);
    });
    
});


/* ========== JOIN A LEAGUE ========== */
router.put('/join', jwtAuth, (req, res, next) => {
  const userId = req.user.id;
  const { name } = req.body;

  League.find({name})
    .then(league => {
      const verify = league[0].users.filter(player => player === userId); 

      if (verify.length < 1) {
        if(league[0].users.length <= 4) {
          league[0].users.push(userId);

          return League.findOneAndUpdate({name}, {users: league[0].users}, {returnNewDocument: true});
        }
        else {
          let err = new Error('That league is full, please select or create another');
          err.status = 400;

          throw err;
        }
      }
      else {
        let err = new Error('You are already in this league!');
        err.status = 422;

        throw err;
      }
    })
    .then(league => res.json(league) )
    .catch(err =>next(err));
 
});

module.exports = router;