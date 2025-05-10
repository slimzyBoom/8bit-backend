import exppress from "express";
import {
  getCategoriesController,
  createTriviaSessionController,
  triviaAnswerController,
} from "../controllers/trivial.controller.js";
import { TrivialSessionSchema } from "../joi_schemas/trivial.schema.js";
import validatePayload from "../middleware/validatePayload.js";

const router = exppress.Router();

router.get("/categories", getCategoriesController);
router.post("/create-session", validatePayload(TrivialSessionSchema, "query"),  createTriviaSessionController);
router.post("/answer/:sessionId", triviaAnswerController);

export default router;
