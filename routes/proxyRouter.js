'use strict';

const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const btoa = require('btoa');

const { API_ACTIVE_PLAYERS_BASE_URL, API_PLAYER_LOGS_BASE_URL, API_PASSWORD, API_USERNAME } = require('../config');

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
    `${API_ACTIVE_PLAYERS_BASE_URL}?fordate=${today}&playerstats=none`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
        'Accept-Encoding': 'gzip'
      }
    }
  )
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const players = data.activeplayers.playerentry.map(obj => {
        let firstName = obj.player.FirstName;
        let lastName = obj.player.LastName;
        let playerID = obj.player.ID;
        return {
          playerID,
          firstName,
          lastName
        };
      });
      res.json(players);
    })
    .catch(next);
});


/* ========== GET PLAYER STATS FROM MY SPORTS FEED ========== */
router.get('/stats', (req, res, next) => {
  const {playerID} = req.query;

  fetch(
    `${API_PLAYER_LOGS_BASE_URL}?date=since-1-weeks-ago&playerstats=2PM,3PM,FTM,PTS,BS,AST,REB,STL&player=${playerID}`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`)
      }
    }
  )
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.statusText);
      }
      return response.json();
    })
    .then(data => {
   
      if (data.gamelogs === undefined) {
        const logs = [{
          firstName: 'N/A',
          lastName: 'N/A',
          playerID: 'N/A',
          twoPointers: 'N/A',
          threePointers: 'N/A',
          freeThrows: 'N/A',
          rebounds: 'N/A',
          assists: 'N/A',
          steals: 'N/A',
          blocks: 'N/A',
        }];
        res.json(logs);
      }

      const logs = data.playergamelogs.gamelogs.map(obj => ({
        firstName: obj.player.FirstName,
        lastName: obj.player.LastName,
        playerID: obj.player.ID,
        twoPointers: obj.stats.Fg2PtMade['#text'],
        threePointers: obj.stats.Fg3PtMade['#text'],
        freeThrows: obj.stats.FtMade['#text'],
        rebounds: obj.stats.Reb['#text'],
        assists: obj.stats.Ast['#text'],
        steals: obj.stats.Stl['#text'],
        blocks: obj.stats.Blk['#text'],
      }));
      res.json(logs);
    })
    .catch(next);
});


module.exports = router;
