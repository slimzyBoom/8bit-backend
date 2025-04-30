const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/", gameController.getGames); // GET /api/games
router.get("/:slug", gameController.getGameDetails); // GET /api/games/trivia
router.post("/submit", auth, gameController.submitGameScore); // POST /api/games/submit
router.get("/:gameId/leaderboard", gameController.getLeaderboardByGame); 
// Example: GET /api/games/12345/leaderboard



module.exports = router;
