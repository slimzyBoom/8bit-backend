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

async function playTurn(gameId, cardIndex1, cardIndex2) {
  const game = await FlipbitGame.findById(gameId);

  if (!game) {
    throw new Error("Game not found.");
  }

  if (game.isCompleted) {
    throw new Error("Game is already completed.");
  }

  if (
    cardIndex1 === cardIndex2 ||
    cardIndex1 < 0 || cardIndex2 < 0 ||
    cardIndex1 >= game.cards.length || cardIndex2 >= game.cards.length
  ) {
    throw new Error("Invalid card indices.");
  }

  const card1 = game.cards[cardIndex1];
  const card2 = game.cards[cardIndex2];

  if (game.matchedCards.includes(card1) && game.matchedCards.includes(card2)) {
    throw new Error("Cards already matched.");
  }

  game.moves += 1;

  let matched = false;
  if (card1 === card2) {
    matched = true;
    if (!game.matchedCards.includes(card1)) {
      game.matchedCards.push(card1);
    }

    if (game.matchedCards.length * 2 === game.cards.length) {
      game.isCompleted = true;
      game.endedAt = new Date();
      game.score = Math.max(100 - game.moves * 2, 0);
    }
  }

  await game.save();

  return {
    matched,
    card1,
    card2,
    moves: game.moves,
    isCompleted: game.isCompleted
  };
}

async function getUserGames(userId) {
  return await FlipbitGame.find({ user: userId }).sort({ startedAt: -1 });
}

async function getLeaderboard(limit = 10) {
  return await FlipbitGame.find({ isCompleted: true })
    .sort({ score: -1, endedAt: 1 })
    .limit(limit)
    .populate("user", "name");
    
}

module.exports = {
  createGame,
  getGame,
  //flipCard,
  playTurn,
  getUserGames,
  getLeaderboard
};
