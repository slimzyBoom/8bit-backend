import mongoose from "mongoose";

const multiplayer_room_schema = mongoose.Schema({
  roomCode: {
    type: String,
    unique: true,
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  players: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: { type: String, default: "" },
      avatar: { type: String, default: "" },
      score: { type: Number, default: 0 },
      currentQuestionIndex: { type: Number, default: 0 },
      questionsAnswered: [
        {
          questionIndex: { type: Number, required: true },
          answer: { type: String, required: true },
          isCorrect: { type: Boolean, required: true },
          answeredAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  questions: [
    {
      question: String,
      correct_answer: String,
      options: [String],
      category: String,
      difficulty: String,
    },
  ],
  totalQuestions: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["waiting", "in_progress", "completed"],
    default: "waiting",
  },
  createdAt: { type: Date, default: Date.now },
  endedAt: Date,
});

export default mongoose.model("MultiplayerRoom", multiplayer_room_schema);
