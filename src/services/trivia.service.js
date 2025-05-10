const axios = require("axios");
const TriviaSession = require("../models/TriviaSession.model");
const GameStats = require("../models/gameStats.model");
const Question = require("../models/Question.model");
const shuffleArray = require("../utils/shuffle");
const Game = require("../models/game.model"); // ✅ Add this line


// Local fallback questions
const hardcodedQuestions = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["Lyon", "Marseille", "Nice"],
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Earth", "Saturn", "Jupiter"],
  },
  {
    question: "Who is the president of Nigeria?",
    correct_answer: "Tinubu",
    incorrect_answers: ["Buhari", "Peter Obi", "Atiku"],
  },
];

// Fetch trivia questions from API, DB, or hardcoded
const fetchTriviaQuestions = async (amount = 5, difficulty = "easy") => {
  try {
    const res = await axios.get(
      `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
    );

    const questions = res.data.results.map((q) => {
      const allAnswers = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
      return {
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
        all_answers: allAnswers,
        difficulty,
      };
    });

    await Question.insertMany(questions);
    return questions;

  } catch (err) {
    console.warn("⚠️ OpenTDB API failed. Trying DB fallback...");

    const dbFallback = await Question.aggregate([
      { $match: { difficulty } },
      { $sample: { size: amount } },
    ]);

    if (dbFallback.length > 0) return dbFallback;

    console.warn("⚠️ DB empty. Using hardcoded questions.");
    return hardcodedQuestions.map((q) => ({
      ...q,
      all_answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
      difficulty,
    }));
  }
};

// Start a new trivia session
const startTriviaSession = async (userId, amount, difficulty) => {
  const questions = await fetchTriviaQuestions(amount, difficulty);
  const session = await TriviaSession.create({ 
    user: userId, 
    questions, 
    score: 0, 
    startTime: new Date(),
  });
  return session;
};

// Submit answer to a question
const submitAnswer = async (sessionId, questionIndex, answer) => {
  const session = await TriviaSession.findById(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }
  const question = session.questions[questionIndex];
  const isCorrect = question.correct_answer === answer;

  session.questions[questionIndex].user_answer = answer;
  session.questions[questionIndex].is_correct = isCorrect;

  if (isCorrect) session.score += 1;
  await session.save();

  return { isCorrect, score: session.score };
};

const submitFinalScore = async (userId, sessionId, score, difficulty = "easy") => {
  const session = await TriviaSession.findById(sessionId);
  if (!session) throw new Error("Session not found");

  const endTime = new Date();
  const durationInSeconds = Math.floor((endTime - session.startTime) / 1000); // auto-calculated

  // ✅ Find the game by slug or name
  const triviaGame = await Game.findOne({ slug: "trivia" }); // or { name: "Trivia" }
  if (!triviaGame) throw new Error("Trivia game not found");

  const stat = await GameStats.create({
    user: userId,
    score,
    duration: durationInSeconds,
    difficulty,
    game: triviaGame._id,
  });

  session.completed = true;
  await session.save();

  return stat;
};

module.exports = {
  fetchTriviaQuestions,
  startTriviaSession,
  submitAnswer,
  submitFinalScore,
};
