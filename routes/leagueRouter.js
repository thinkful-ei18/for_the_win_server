'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

const League = require('../models/League.model');

const options = { session: false, failWithError: true };
const jwtAuth = passport.authenticate('jwt', options);


/* ========== RETRIEVE ALL LEAGUES ========== */
// returns an array of one or more objects
router.get('/', jwtAuth, (req, res, next) => {

  League.find({})
    .sort({ name: 1 })
    .then( leagues => {
      const sendToUser = leagues.map(league => league.return());
      res.json(sendToUser);
    })
    .catch(err => next(err));
  
});


/* ========== CREATE A LEAGUE ========== */
// returns a single object
router.post('/add', jwtAuth, (req, res, next) => {
  const user = req.user;
  let { name } = req.body;

  League.find({ name })
    .count()
    .then( number => {
      console.log('NUMBER:', number);
      if (number >= 1) {
        return Promise.reject({
          status: 422,
          reason: 'Validation Error',
          message: `The league "${name}" already exists.`,
          location: 'name'
        });
      }

      return League.create({
        name: name.toLowerCase(),
        users: [{ 
          userId: user.id,
          username: user.username,
          team: user.teamName
        }]
      });
    })
    .then(league => {
      console.log('LEAGUE:', league);
      return res.status(201).location(`${req.originalUrl}/${league.id}`).json(league.return());
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
// returns a single object
router.put('/join', jwtAuth, (req, res, next) => {
  const user = req.user;
  const { name } = req.body;

  League.find({name: name.toLowerCase()})
    .then(league => {
      const verify = league[0].users.filter(obj => obj.userId === user.id); 

      if (verify.length < 1) {

        if(league[0].users.length <= 4) {
          return League.findOneAndUpdate(
            { name: name.toLowerCase() }, 
            { $push: 
              { users: { 
                userId: user.id,
                username: user.username,
                team: user.teamName
              }}
            }, 
            { new: true }
          );
        }
        else {
          let err = new Error('That league is full, please select or create another');
          err.status = 422;

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


/* ========== RETRIEVE USER'S LEAGUE ========== */
// returns an array with one object
// this path has to be at the bottom, otherwise the '/add' & '/join' paths will match it.
router.get('/:name', jwtAuth, (req, res, next) => {
  const { name } = req.params;

  League.find({ name })
    .then(league => res.json(league))
    .catch(err => next(err));

});

module.exports = router;