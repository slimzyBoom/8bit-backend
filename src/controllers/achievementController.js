const achievementService = require('../services/achievement.service');

const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await achievementService.getAllAchievements();
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

const getUserAchievements = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const achievements = await achievementService.getUserAchievements(userId);
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

const awardAchievement = async (req, res, next) => {
  try {
    const { userId, achievementId } = req.body;
    await achievementService.awardAchievement(userId, achievementId);
    res.status(201).json({ message: 'Achievement awarded' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAchievements, getUserAchievements, awardAchievement };