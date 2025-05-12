import mongoose, { Schema } from "mongoose";

const archievementSchema = new mongoose.Schema({
  key: String,
  description: String,
  archieved: Boolean,
  archievedAt: { type: Date, default: Date.now },
});



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  display_name: {
    type: String,
    default: function () {
      return this.username;
    },
  },
  bio: {
    type: String,
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
  friends: [String],
  friend_request_list: [String],
  avatar: String,
  nationality: {
    name: String,
    flag: String,
  },
  stat: {
    number_games_played: {
      type: Number,
      default: 0,
    },
    number_wins: {
      type: Number,
      default: 0,
    },
    number_losses: {
      type: Number,
      default: 0,
    },
    number_points: {
      type: Number,
      default: 0,
    },
  },
  archievements: [archievementSchema],
});

const User = mongoose.model("User", userSchema);
export default User;
