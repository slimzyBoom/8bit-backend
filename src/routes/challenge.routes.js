const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  createRoom,
  joinRoom,
  submitAnswer,
} = require("../controllers/challenge.controller");

router.post("/create", auth, createRoom);
router.post("/:roomId/join", auth, joinRoom);
router.post("/submit", auth, submitAnswer);

module.exports = router;
