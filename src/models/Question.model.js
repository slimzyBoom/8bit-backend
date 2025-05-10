const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  correct_answer: String,
  incorrect_answers: [String],
  all_answers: [String], // already shuffled
  difficulty: { type: String, default: "easy" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
