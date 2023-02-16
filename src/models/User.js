const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 15,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
