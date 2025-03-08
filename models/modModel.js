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
  fileHash: {
    type: String,
    required: true
  },
  downloadLink: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pak', 'sig', 'zip'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mod', modSchema);
