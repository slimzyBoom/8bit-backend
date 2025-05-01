const axios = require("axios");
const TriviaSession = require("../models/TriviaSession.model");
const shuffleArray = require("../utils/shuffle");
const GameStats = require("../models/gameStats.model");

const fetchTriviaQuestions = async (amount = 5, difficulty = "easy") => {
  const res = await axios.get(
    `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
  );
  const questions = res.data.results.map((q) => {
    const allAnswers = shuffleArray([
      ...q.incorrect_answers,
      q.correct_answer,
    ]);
    return {
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
      all_answers: allAnswers,
    };
  });
  return questions;
};

const startTriviaSession = async (userId, amount, difficulty) => {
  const questions = await fetchTriviaQuestions(amount, difficulty);
  const session = await TriviaSession.create({ user: userId, questions });
  return session;
};

const submitAnswer = async (sessionId, questionIndex, answer) => {
  const session = await TriviaSession.findById(sessionId);
  const question = session.questions[questionIndex];
  const isCorrect = question.correct_answer === answer;
  session.questions[questionIndex].user_answer = answer;
  session.questions[questionIndex].is_correct = isCorrect;
  if (isCorrect) session.score += 1;
  await session.save();
  return { isCorrect, score: session.score };
};

const submitFinalScore = async (userId, score, duration, difficulty = "easy") => {
  const stat = await GameStats.create({
    user: userId,
    score,
    duration,
    difficulty,
    game: "Trivia",
  });
  return stat;
};

module.exports = {
  fetchTriviaQuestions,
  startTriviaSession,
  submitAnswer,
  submitFinalScore, // <-- don't forget to export it
};
