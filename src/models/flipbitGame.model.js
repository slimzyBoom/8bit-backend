const mongoose = require("mongoose");

const FlipbitGameSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  cards: [{ type: String, required: true }],
  matchedCards: [{ type: String, default: [] }],
  moves: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

module.exports = mongoose.model("FlipbitGame", FlipbitGameSchema);
