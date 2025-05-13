const gameService = require("../services/flipbitGame.service");

async function startGame(req, res) {
  const { difficulty } = req.body;
  const userId = req.user._id;
  try {
    const game = await gameService.createGame(userId, difficulty);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function playTurn(req, res) {
  const { gameId } = req.params;
  const { cardIndex1, cardIndex2 } = req.body;
  const userId = req.user._id;
  try {
    const result = await gameService.flipCard(gameId, userId, cardIndex1, cardIndex2);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getHistory(req, res) {
  const userId = req.user._id;
  try {
    const history = await gameService.getUserGames(userId);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLeaderboard(req, res) {
  try {
    const data = await gameService.getLeaderboard();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  startGame,
  playTurn,
  getHistory,
  getLeaderboard
};
