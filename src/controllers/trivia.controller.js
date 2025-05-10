const {
    fetchTriviaQuestions,
    startTriviaSession,
    submitAnswer,
    submitFinalScore
  } = require("../services/trivia.service");

  
  exports.startSession = async (req, res) => {
    try {
      const { amount = 3, difficulty = "easy" } = req.query;
      const userId = req.user._id;
  
      const session = await startTriviaSession(userId, amount, difficulty);
  
      res.status(200).json({
        message: "Trivia session started",
        sessionId: session._id, // ✅ clearly send session ID
        score: session.score,
        questions: session.questions.map((q, index) => ({
          index,
          question: q.question,
          all_answers: q.all_answers,
          correct_answer: q.correct_answer
        })),
      });
    } catch (error) {
      console.error("❌ Error starting trivia session:", error);
      res.status(500).json({ message: "Failed to start session" });
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
    const { score, sessionId, difficulty } = req.body;
    const userId = req.user._id;

 // Basic validation
 if (!sessionId || typeof sessionId !== "string") {
  return res.status(400).json({ success: false, message: "Invalid or missing sessionId" });
}

if (typeof score !== "number" || score < 0) {
  return res.status(400).json({ success: false, message: "Score must be a non-negative number" });
}

 try{
    const stat = await submitFinalScore(userId, sessionId, score, difficulty);
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