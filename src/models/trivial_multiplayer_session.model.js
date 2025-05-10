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
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      score: { type: Number, default: 0 },
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
  currentQuestionIndex: { type: String, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["waiting", "in_progress", "completed"],
    default: "waiting",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MultiplayerRoom", multiplayer_room_schema);
