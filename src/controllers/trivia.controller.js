const {
    fetchTriviaQuestions,
    startTriviaSession,
    submitAnswer,
    submitFinalScore
  } = require("../services/trivia.service");

  
  exports.startSession = async (req, res, next) => {
    try {
      const { amount = 5, difficulty = "easy" } = req.query;
      const userId = req.user._id;
      const session = await startTriviaSession(userId, amount, difficulty);
      res.status(200).json(session);
    } catch (err) {
      next(err);
    }
  };
  
  exports.answerQuestion = async (req, res, next) => {
    try {
      const { sessionId, questionIndex, answer } = req.body;
      const result = await submitAnswer(sessionId, questionIndex, answer);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
  

exports.submitScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const { score, duration, difficulty } = req.body;

    const stat = await submitFinalScore(userId, score, duration, difficulty);
    res.status(201).json({ success: true, stat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.fetchQuestions = async (req, res, next) => {
  try {
    const { amount = 5, difficulty = "easy" } = req.query;
    const questions = await fetchTriviaQuestions(amount, difficulty);
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
};