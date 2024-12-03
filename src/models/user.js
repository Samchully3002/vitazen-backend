// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  emailAddress: { type: String, required: true, unique: true },
  identityNumber: { type: String, required: true, unique: true },
});

userSchema.index({ accountNumber: 1 });
userSchema.index({ identityNumber: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
