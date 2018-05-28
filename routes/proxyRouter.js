'use strict';

const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const btoa = require('btoa');
const passport = require('passport');

const { API_ROSTER_PLAYERS_BASE_URL, API_PLAYER_LOGS_BASE_URL, API_DAILY_GAME_SCHEDULE_BASE_URL, API_CUMULATIVE_STATS_BASE_URL, API_PASSWORD, API_USERNAME } = require('../config');
const League = require('../models/League.model');
const User = require('../models/User.model');
const options = { session: false, failWithError: true };
const jwtAuth = passport.authenticate('jwt', options);

const todayString = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }
  return `${yyyy}${mm}${dd}`;
};


/* ========== GET ALL ACTIVE PLAYERS FROM MY SPORTS FEED ========== */
router.get('/players', (req, res, next) => {
  const today = todayString();

  fetch(
    `${API_ROSTER_PLAYERS_BASE_URL}?fordate=${today}`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        'Accept-Encoding': 'gzip'
      }
    }
  )
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          status: response.status,
          message: response.statusText});
      }
      return response.json();
    })
    .then(data => {
      const currentlySignedPlayers = data.rosterplayers.playerentry.filter(obj => obj.team !== undefined);

      const selectablePlayers = currentlySignedPlayers.map(obj => {
        const firstName = obj.player.FirstName;
        const lastName = obj.player.LastName;
        const playerID = obj.player.ID;
        const playerTeam = `${obj.team.City} ${obj.team.Name}`;
        return {
          playerID,
          firstName,
          lastName,
          playerTeam
        };
      });

      res.json(selectablePlayers);
    })
    .catch(next);
});


/* ========== GET PLAYER STATS FROM MY SPORTS FEED ========== */
router.get('/stats', (req, res, next) => {

  const playerID = req.query.player;

  fetch(
    `${API_PLAYER_LOGS_BASE_URL}?date=since-1-weeks-ago&playerstats=2PM,3PM,FTM,PTS,BS,AST,REB,STL&player=${playerID}`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        'Accept-Encoding': 'gzip'
      }
    }
  )
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          status: response.status,
          message: response.statusText});
      }
      return response.json();
    })
    .then(data => {

      if (data.playergamelogs.gamelogs === undefined) {
        const logs = [{
          firstName: 'N/A',
          lastName: 'N/A',
          dateOfGame: 'N/A',
          playerID: playerID,
          twoPointers: 'N/A',
          threePointers: 'N/A',
          freeThrows: 'N/A',
          totalPoints: 'N/A',
          rebounds: 'N/A',
          assists: 'N/A',
          steals: 'N/A',
          blocks: 'N/A',
        }];
        res.json(logs);
      } else {
        const logs = data.playergamelogs.gamelogs.map(obj => ({
          firstName: obj.player.FirstName,
          lastName: obj.player.LastName,
          dateOfGame: obj.game.date,
          playerID: obj.player.ID,
          twoPointers: obj.stats.Fg2PtMade['#text'],
          threePointers: obj.stats.Fg3PtMade['#text'],
          freeThrows: obj.stats.FtMade['#text'],
          totalPoints: obj.stats.Pts['#text'],
          rebounds: obj.stats.Reb['#text'],
          assists: obj.stats.Ast['#text'],
          steals: obj.stats.Stl['#text'],
          blocks: obj.stats.Blk['#text'],
        }));
        res.json(logs);
      }

    })
    .catch(next);
});


/* ========== GET DAILY GAME SCHEDULE FROM MY SPORTS FEED ========== */

router.get('/games', (req, res, next) => {
  const today = todayString();

  fetch(`${API_DAILY_GAME_SCHEDULE_BASE_URL}?fordate=${today}`, {
    headers: {
      'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
      'Accept-Encoding': 'gzip'
    }
  })
    .then(response => {
      if (!response.ok) {
        return Promise.reject({
          status: response.status,
          message: response.statusText});
      }
      return response.json();
    })
    .then(data => {
      let games;
      if(data.dailygameschedule.gameentry) {
        games = data.dailygameschedule.gameentry.map( obj => ({
          gameDate: obj.date,
          gameTime: obj.time,
          awayTeam: `${obj.awayTeam.City} ${obj.awayTeam.Name}`,
          homeTeam: `${obj.homeTeam.City} ${obj.homeTeam.Name}`
        }));
      }
      else {
        games = false;
      }
      res.json(games);
    })
    .catch(next);

});


/* ========== GET USER'S LEADERBOARD FROM MY SPORTS FEED ========== */
router.get('/league/:name', jwtAuth, (req, res, next) => {
  const { name } = req.params;

  const fetchCumStats = (collectionOfIds, playerIDArray) => {
    // fetching the cumulative stats for the current (regular & playoff) season. 
   
    let playerIds = playerIDArray.toString();

    return fetch(`${API_CUMULATIVE_STATS_BASE_URL}?player=${playerIds}&playerstats=2PM,3PM,FTM,PTS,BS,AST,REB,STL`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        'Accept-Encoding': 'gzip'
      }
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject({
            status: response.status,
            message: response.statusText});
        }
        return response.json();
      })
      .then(data => {
        
        let arrayofStats = data.cumulativeplayerstats.playerstatsentry.map( obj => ({
          playerId: obj.player.ID,
          twoPointers: obj.stats.Fg2PtMade['#text'],
          threePointers: obj.stats.Fg3PtMade['#text'],
          freeThrows: obj.stats.FtMade['#text'],
          totalPoints: obj.stats.Pts['#text'],
          rebounds: obj.stats.Reb['#text'],
          assists: obj.stats.Ast['#text'],
          steals: obj.stats.Stl['#text'],
          blocks: obj.stats.Blk['#text']
        })
        );
        
        return arrayofStats;
      })
      .then( arrayofStats => collectionOfIds.map( array => 
        array.map( id => 
          arrayofStats.find(obj => 
            obj.playerId === id)))
      )
      .catch(err => next(err));
  };

  
  let users = [];

  League.find({ name })
    .then(league => {
      let rivals = league[0].users.map(user => {

        users.push({ [user.username]: 0 });
        return user.userId;
      }); 

      return Promise.all( rivals.map( id => 
        User.find({ _id: id})
          .then(user => user)
      ));
    })
    .then(users => users.map( user => user[0].team))
    .then(teams => 
      teams.map(team => 
        team.map( player => 
          player.playerID)
      ))
    .then(collectionOfIds => {

      let allPlayerIds = [];
      collectionOfIds.map( playerIds => 
        playerIds.map( id =>
          allPlayerIds.push(id)
        ));

      return fetchCumStats(collectionOfIds, allPlayerIds);
    })
    .then(collectionOfStats => collectionOfStats.map(doc => 
      doc.map( stat => 
        parseInt(stat.twoPointers, 10) 
        + parseInt(stat.threePointers, 10) 
        + parseInt(stat.freeThrows, 10) 
        + parseInt(stat.assists, 10) 
        + parseInt(stat.rebounds, 10) 
        + parseInt(stat.steals, 10) 
        + parseInt(stat.blocks, 10)
      )))
    .then(playerStatTotals =>
      playerStatTotals.map(team => {
        let score = 0;
        team.map(player => 
          score += player);

        return score;
      })
    )
    .then(score => {
 
      const leaderboard = users.map((user, index) => {
        let key = Object.keys(user);
        user[key[0]] = score[index];

        return user;
      });

      res.status(200).json(leaderboard);
    })
    .catch(err => next(err));

});


module.exports = router;
