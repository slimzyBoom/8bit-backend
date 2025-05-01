const axios = require("axios");
const TriviaSession = require("../models/TriviaSession.model");
const shuffleArray = require("../utils/shuffle");
const GameStats = require("../models/gameStats.model");

// Fetch trivia questions from API or fallback
const fetchTriviaQuestions = async (amount = 5, difficulty = "easy") => {
  let res;

  try {
    // Try to fetch from OpenTDB API
    res = await axios.get(
      `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
    );
  } catch (err) {
    console.error("🛑 OpenTDB API failed. Using fallback questions for testing.");

    // Use fallback hardcoded questions
    res = {
      data: {
        results: [
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
        ],
      },
    };
  }

  // Format questions with shuffled answers
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

// Start a new trivia session
const startTriviaSession = async (userId, amount, difficulty) => {
  const questions = await fetchTriviaQuestions(amount, difficulty);
  const session = await TriviaSession.create({ user: userId, questions, score: 0 });
  return session;
};

// Submit answer to a question
const submitAnswer = async (sessionId, questionIndex, answer) => {
  const session = await TriviaSession.findById(sessionId);
  const question = session.questions[questionIndex];
  const isCorrect = question.correct_answer === answer;

  // Record user's answer and correctness
  session.questions[questionIndex].user_answer = answer;
  session.questions[questionIndex].is_correct = isCorrect;

  if (isCorrect) session.score += 1;

  await session.save();
  return { isCorrect, score: session.score };
};

// Submit final score and save stats
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
  submitFinalScore,
};
