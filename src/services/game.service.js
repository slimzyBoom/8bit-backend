const Game = require("../models/Game");

const getAllGames = async () => {
  return await Game.find();
};

const getGameBySlug = async (slug) => {
  return await Game.findOne({ slug });
};

module.exports = {
  getAllGames,
  getGameBySlug,
};

const GameStats = require("../models/GameStats");

const submitScore = async ({ userId, gameId, score, duration, difficulty }) => {
  const stat = new GameStats({
    user: userId,
    game: gameId,
    score,
    duration,
    difficulty,
  });
  return await stat.save();
};

const getUserGameStats = async (userId, gameId) => {
  return await GameStats.find({ user: userId, game: gameId })
    .sort({ createdAt: -1 })
    .limit(10);
};

module.exports = {
  ...module.exports,
  submitScore,
  getUserGameStats,
};
