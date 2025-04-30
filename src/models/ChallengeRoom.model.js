const mongoose = require("mongoose");

const challengeRoomSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  questions: [
    {
      question: String,
      correct_answer: String,
      incorrect_answers: [String],
      all_answers: [String],
    },
  ],
  hostAnswers: [
    {
      answer: String,
      isCorrect: Boolean,
    },
  ],
  guestAnswers: [
    {
      answer: String,
      isCorrect: Boolean,
    },
  ],
  status: {
    type: String,
    enum: ["waiting", "in_progress", "completed"],
    default: "waiting",
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChallengeRoom", challengeRoomSchema);
