const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: String,
  text: String,
  filename: String,
  mimetype: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transcription', schema);
