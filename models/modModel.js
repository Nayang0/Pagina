// models/modModel.js
const mongoose = require('mongoose');

const modSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  downloadLink: {
    type: String,
    required: true
  }
});

const Mod = mongoose.model('Mod', modSchema);

module.exports = Mod;
