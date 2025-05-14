import { getCategories } from "../services/trivial_api.service.js";
import createTriviaSession from "../services/trivial_session.service.js";
import trivial_sessionModel from "../models/trivial_session.model.js";

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
  const { questionIndex, answer } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required", success: false });
  }

  try {
    const session = await trivial_sessionModel.findOne({ sessionId }).exec();

    if (!session) {
      return res.status(404).json({ error: "Session not found", success: false });
    }

    if (session.completed) {
      return res.status(400).json({ error: "Session already completed", success: false });
    }

    if (
      questionIndex !== session.currentQuestionIndex ||
      questionIndex >= session.totalQuestions
    ) {
      return res.status(400).json({ error: "Invalid question index", success: false });
    }

    const question = session.questions[questionIndex];
    const isCorrect = question.correct_answer === answer;

    session.answeredQuestions.push({
      questionIndex,
      answer,
      isCorrect,
      answeredAt: new Date(),
    });

    if (isCorrect) session.score += 1;

    session.currentQuestionIndex += 1;

    if (session.currentQuestionIndex >= session.totalQuestions) {
      session.completed = true;
    }

    await session.save();

    res.status(200).json({
      message: "Answer recorded successfully",
      score: session.score,
      isCorrect,
      currentQuestionIndex: session.currentQuestionIndex,
      completed: session.completed,
    });

  } catch (error) {
    console.error("Error recording answer:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};


export const handleResultController = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await trivial_sessionModel.findOne({ sessionId }).exec();
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found", success: false });
    }
    if (!session.completed) {
      return res
        .status(400)
        .json({ message: "Session not completed", success: false });
    }
    const correctanswers = session.answeredQuestions.filter((question) => {
      return question.isCorrect === true;
    });
    if (correctanswers.length === session.totalQuestions) {
      session.isWinner = true;
      session.completed = true;
      await session.save();
      return res.json({
        success: true,
        message: "You are the winner!",
        data: {
          sessionId: session.sessionId,
          score: session.score,
          totalQuestions: session.totalQuestions,
        },
      });
    } else {
      session.isWinner = false;
      session.completed = true;
      await session.save();
      return res.json({
        success: true,
        message: "Sorry you lost this game",
        data: {
          sessionId: session.sessionId,
          score: session.score,
          totalQuestions: session.totalQuestions,
        },
      });
    }
  } catch (error) {
    console.error("Error handling result:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
