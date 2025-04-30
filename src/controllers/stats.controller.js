const { getUserGameStats } = require("../services/stats.service");
const { getLeaderboard } = require("../services/stats.service");

exports.getMyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await getUserGameStats(userId);
    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { game = "Trivia", limit = 10 } = req.query;
    const leaderboard = await getLeaderboard(game, parseInt(limit));
    res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
