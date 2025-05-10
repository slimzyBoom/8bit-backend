import mongoose from "mongoose";

const triviaSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sessionId: { type: String, required: true, unique: true },
  category: String,
  difficulty: String,
  questions: [
    {
      question: String,
      correct_answer: String,
      options: [String],
      category: String,
      difficulty: String,
    },
  ],
  currentQuestionIndex: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  answeredQuestions: [
    {
      questionIndex: { type: Number, required: true },
      answer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
      answeredAt: { type: Date, default: Date.now },
    }
  ],
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TriviaSession", triviaSessionSchema);
