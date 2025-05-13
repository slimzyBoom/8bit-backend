const FlipbitGame = require("../models/flipbitGame.model");

const cardPool = ["🍎", "🍌", "🍇", "🍓", "🍍", "🥝", "🍒", "🍉"];

function getCardCount(difficulty) {
  if (difficulty === "easy") return 4;
  if (difficulty === "medium") return 6;
  return 8; // hard
}

async function createGame(userId, difficulty) {
  const pairCount = getCardCount(difficulty);
  const selected = cardPool.slice(0, pairCount);
  const cards = [...selected, ...selected].sort(() => Math.random() - 0.5); // shuffle

  const game = new FlipbitGame({
    user: userId,
    difficulty,
    cards
  });

  return await game.save();
}

async function getGame(gameId, userId) {
  return await FlipbitGame.findOne({ _id: gameId, user: userId });
}

async function flipCard(gameId, userId, cardIndex1, cardIndex2) {
  const game = await getGame(gameId, userId);
  if (!game || game.isCompleted) throw new Error("Invalid or completed game");

  const card1 = game.cards[cardIndex1];
  const card2 = game.cards[cardIndex2];

  game.moves += 1;

  if (
    card1 === card2 &&
    cardIndex1 !== cardIndex2 &&
    !game.matchedCards.includes(card1)
  ) {
    game.matchedCards.push(card1);
  }

  if (game.matchedCards.length === game.cards.length / 2) {
    game.isCompleted = true;
    game.endedAt = new Date();
  }

  await game.save();
  return {
    matched: card1 === card2,
    matchedCards: game.matchedCards,
    isCompleted: game.isCompleted,
    moves: game.moves
  };
}

async function getUserGames(userId) {
  return await FlipbitGame.find({ user: userId }).sort({ startedAt: -1 });
}

async function getLeaderboard(limit = 10) {
  return await FlipbitGame.find({ isCompleted: true })
    .sort({ moves: 1, endedAt: 1 })
    .limit(limit)
    .populate("user", "name");
}

module.exports = {
  createGame,
  getGame,
  flipCard,
  getUserGames,
  getLeaderboard
};
