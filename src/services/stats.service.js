const GameStats = require("../models/GameStats");

const getUserGameStats = async (userId) => {
  return await GameStats.find({ user: userId }).sort({ createdAt: -1 });
};

const getLeaderboard = async (game, limit = 10) => {
  return await GameStats.find({ game })
    .sort({ score: -1, createdAt: 1 }) // highest score, older first if tie
    .limit(limit)
    .populate("user", "username avatar"); // show username & avatar only
};

module.exports = {
  getUserGameStats,
  getLeaderboard,
};
