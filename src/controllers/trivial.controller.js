import { getCategories } from "../services/trivial_api.service.js";
import createTriviaSession from "../services/trivial_session.service.js";
import trivial_session_model from "../models/trivial_multiplayer_session.model.js";

export const getCategoriesController = async (req, res) => {
  try {
    const categories = await getCategories();
    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ error: "No categories found", success: false });
    }
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTriviaSessionController = async (req, res) => {
  const { category, difficulty, type, amount } = req.query;
  const { id } = req.user;

  try {
    const session = await createTriviaSession(id, {
      category,
      difficulty,
      type,
      amount,
    });
    res.status(201).json({ data: session, success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", success: false });
    console.error("Error creating trivia session:", error);
  }
};

export const triviaAnswerController = async (req, res) => {
  const { sessionId } = req.params;
  const { questionIndex, answer, isCorrect } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required", success: false  });
  }
  try {
    const session = await trivial_session_model.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    if (session.completed) {
      return res.status(400).json({ message: "Session already completed" });
    }
    if (session.currentQuestionIndex !== questionIndex) {
      return res.status(400).json({ message: "Invalid question index" });
    }
    if (isCorrect) {
      session.score += 1;
    }
    session.currentQuestionIndex += 1;
    if (session.currentQuestionIndex >= session.totalQuestions) {
      session.completed = true;
    }

    session.answeredQuestions.push({
      questionIndex,
      answer,
      isCorrect,
    });

    await session.save();
    res.status(200).json({
      message: "Answer recorded successfully",
      score: session.score,
      currentQuestionIndex: session.currentQuestionIndex,
      completed: session.completed,
    });
  } catch (error) {
    console.error("Error recording answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
