import exppress from "express";
import {
  getCategoriesController,
  createTriviaSessionController,
  triviaAnswerController,
  handleResultController
} from "../controllers/trivial.controller.js";
import { generateAndSaveRoom } from "../controllers/trivia_multiplayer.controller.js";

import { TrivialSessionSchema } from "../joi_schemas/trivial.schema.js";
import validatePayload from "../middleware/validatePayload.js";

const router = exppress.Router();

router.get("/categories", getCategoriesController);
router.post("/single-player/create-session", validatePayload(TrivialSessionSchema, "query"),  createTriviaSessionController);
router.post("/single-player/answer/:sessionId", triviaAnswerController);
router.get("/single-player/result/:sessionId", handleResultController);
router.post("/multi-player/generate-room", generateAndSaveRoom);

export default router;
