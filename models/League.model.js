'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leagueSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  users: {
    type: Array,
    required: true,
  },
  players: {
    type: Array,
    required: true,
    default: []
  }
});


leagueSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
  
// what will show on screen when you do a res.json()
leagueSchema.methods.return = function () {
  return {
    name: this.name,
    users: this.users,
    players: this.players
  };
};

// how to access the collection
const League = mongoose.model('League', leagueSchema);

module.exports = League;


/**
 - name of league (string)
 - users in league (array of id's from bearer token)
 - prop with all players across all members in league (array)
 */