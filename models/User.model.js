'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema ({
  fullName: { type: String },
  email: { type: String, trim: true, lowercase: true, unique: true, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamName: { type: String, trim: true, required: true },
  team: { type: Array, default: [] },
  leagueName: { type: String }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.return = function () {
  return {
    id: this.id,
    fullName: this.fullName,
    username: this.username,
    teamName: this.teamName,
    team: this.team
  };
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;


