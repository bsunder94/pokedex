const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  id: String,
  name: String,
  set: String,
  imageUrl: String,
  marketPrice: Number
});

module.exports = mongoose.model('Card', CardSchema);