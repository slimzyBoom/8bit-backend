const express = require("express");
const router = express.Router();
const { 
    startGame,
    playTurn, 
    getHistory, 
    getLeaderboard 
} = require("../controllers/flipbitGame.controller");

const { authenticate } = require("../middlewares/auth.middleware");

router.post("/start", authenticate, startGame);
router.post("/:gameId/flip", authenticate, playTurn);
router.get("/history", authenticate, getHistory);
router.get("/leaderboard", getLeaderboard);



module.exports = router;
