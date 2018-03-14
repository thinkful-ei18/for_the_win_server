'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
  fullName: { type: String },
  email: { type: String, trim: true, lowercase: true, unique: true, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamName: { type: String, trim: true, required: true },
  team: { type: Array, default: [] }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


