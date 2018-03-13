'use strict';

const express = require('express');
const router = express.Router();
const fetch = require('isomorphic-fetch');
const btoa = require('btoa');

const { API_ACTIVE_PLAYERS_BASE_URL, API_PASSWORD, API_USERNAME } = require('../config');
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

module.exports = router;
