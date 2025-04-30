const gameService = require("../services/game.service");

const getGames = async (req, res) => {
  try {
    const games = await gameService.getAllGames();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Failed to load games." });
  }
};

const getGameDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const game = await gameService.getGameBySlug(slug);

    if (!game) return res.status(404).json({ message: "Game not found" });

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: "Error getting game details" });
  }
};

const submitGameScore = async (req, res) => {
  try {
    const { gameId, score, duration, difficulty } = req.body;
    const userId = req.user._id;

    const result = await gameService.submitScore({
      userId,
      gameId,
      score,
      duration,
      difficulty,
    });

    res.status(201).json({ message: "Score submitted!", data: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit score." });
  }
};

module.exports = {
  getGames,
  getGameDetails,
  submitGameScore,
};
