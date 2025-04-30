const express = require("express");
const router = express.Router();
const { getMyStats } = require("../controllers/stats.controller");
const auth = require("../middlewares/auth.middleware");
const { getMyStats, getLeaderboard } = require("../controllers/stats.controller");

router.get("/me", auth, getMyStats); // GET /api/stats/me
router.get("/leaderboard", getLeaderboard); // GET /api/stats/leaderboard

module.exports = router;
