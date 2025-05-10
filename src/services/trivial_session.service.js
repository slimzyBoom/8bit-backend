import { v4 as uuidv4 } from "uuid";
import TriviaSessionModel from "../models/trivial_session.model.js";
import { getTrivialQuiz } from "./trivial_api.service.js";

// Create a new trivia session
async function createTriviaSession(userId, options) {
  try {
    const sessionId = uuidv4();
    const questions = await getTrivialQuiz(options);

    const session = new TriviaSessionModel({
      sessionId,
      userId,
      category: options.category || 9,
      difficulty: options.difficulty || "easy",
      questions,
      totalQuestions: questions.length,
      score: 0,
      completed: false,
      currentQuestionIndex: 0,
      createdAt: new Date(),
    });

    await session.save();

    // Strip out correctAnswer before sending to client
    const clientSession = {
      sessionId,
      category: options.category || 9,
      difficulty: options.difficulty || "easy",
      currentQuestionIndex: 0,
      questions,
    };

    return clientSession;
  } catch (error) {
    console.error("Error creating trivia session:", error);
    throw new Error("Failed to create trivia session.");
  }
}

export default createTriviaSession;
