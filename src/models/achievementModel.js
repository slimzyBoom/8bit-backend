const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Achievement', achievementSchema);