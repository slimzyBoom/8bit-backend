const mongoose = require("mongoose");

const triviaSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: [
    {
      question: String,
      correct_answer: String,
      incorrect_answers: [String],
      all_answers: [String],
      user_answer: String,
      is_correct: Boolean,
    },
  ],
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TriviaSession", triviaSessionSchema);
