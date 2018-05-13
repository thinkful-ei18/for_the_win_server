'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const League = new Schema({
  name: {
    type: String
  },
  players: {
    type: Array
  }
});

/**
 * when a user joins the league and adds a player, that player gets added to the players prop
 */