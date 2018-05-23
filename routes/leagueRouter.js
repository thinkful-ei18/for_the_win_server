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
    .sort({ name: 1 })
    .then( leagues => {
      const sendToUser = leagues.map(league => league.return());
      res.json(sendToUser);
    })
    .catch(err => next(err));
  
});

/* ========== RETRIEVE USER'S LEAGUE ========== */
router.get('/', jwtAuth, (req, res, next) => {

  // get userId
  // search users array within each league to see if this user's id is in there
  // if so, return that league
  
  // const userId = req.user.id;

  
});



/* ========== CREATE A LEAGUE ========== */
router.post('/add', jwtAuth, (req, res, next) => {
  
  const user = req.user;
  let { name } = req.body;

  League.find({name})
    .count()
    .then( number => {
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

module.exports = router;