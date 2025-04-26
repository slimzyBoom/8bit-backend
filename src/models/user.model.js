import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    friends: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friends",
    },
    gameHistory: [
      {
        gameId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game",
        },
        gameType: {
          type: String,
          enum: ["card", "trivial"],
          required: true,
        },
        score: {
          type: Number,
          default: 0,
        },
        result: {
          type: String,
          enum: ["win", "loss", "draw"],
          default: "loss",
        },
        playedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    archievements: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Archievements",
    },
    stats: [
      {
        gameType: {
          type: String,
          required: true,
        },
        wins: {
          type: Number,
          default: 0,
        },
        losses: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
