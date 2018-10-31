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
  managers: {
    type: Array,
    required: true
  },
  players: {
    type: Array,
    required: true,
    default: []
  },
  draftSchedule: {
    type: Date,
    default: ''
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
    managers: this.managers,
    players: this.players,
    draftSchedule: this.draftSchedule
  };
};

// how to access the collection
const League = mongoose.model('League', leagueSchema);

module.exports = League;