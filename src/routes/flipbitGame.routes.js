const express = require("express");
const router = express.Router();
const { 
    startGame,
    playTurn, 
    getHistory, 
    getLeaderboard 
} = require("../controllers/flipbitGame.controller");

const protect = require("../middlewares/auth.middleware");

router.post("/start", protect, startGame);
router.post("/:gameId/flip", protect, playTurn);
router.get("/history", protect, getHistory);
router.get("/leaderboard", getLeaderboard);



module.exports = router;
