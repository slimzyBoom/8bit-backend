const express = require("express");
const router = express.Router();
const { startSession, answerQuestion } = require("../controllers/trivia.controller");
const auth = require("../middlewares/auth.middleware");
const { startSession, answerQuestion, submitScore } = require("../controllers/trivia.controller");

router.get("/start", auth, startSession);      // GET /api/trivia/start
router.post("/answer", auth, answerQuestion);  // POST /api/trivia/answer
router.post("/submit-score", auth, submitScore);

module.exports = router;





