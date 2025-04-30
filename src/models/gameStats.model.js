const mongoose = require("mongoose");

const gameStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in seconds
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameStats", gameStatsSchema);
