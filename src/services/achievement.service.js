const mongoose = require('mongoose');
const Achievement = require('../models/achievementModel');
const User = require('../models/userModel');
const redisService = require('./redis.service');

/**
 * Get all available achievements
 * @returns {Promise<Array>} Array of achievements
 * @throws {Error} If query fails
 */
const getAllAchievements = async () => {
  const cacheKey = 'achievements:all';
  
  const cachedAchievements = await redisService.getCache(cacheKey);
  if (cachedAchievements) {
    return JSON.parse(cachedAchievements);
  }

  try {
    const achievements = await Achievement.find().lean();
    await redisService.setCache(cacheKey, JSON.stringify(achievements), 86400); // Cache for 24 hours
    return achievements;
  } catch (error) {
    const err = new Error('Failed to fetch achievements');
    err.status = 500;
    throw err;
  }
};

/**
 * Get a user's achievements
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} Array of user's earned achievements with details
 * @throws {Error} If user not found or query fails
 */
const getUserAchievements = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error('Invalid user ID');
    error.status = 400;
    throw error;
  }

  const cacheKey = `user:${userId}:achievements`;
  const cachedAchievements = await redisService.getCache(cacheKey);
  if (cachedAchievements) {
    return JSON.parse(cachedAchievements);
  }

  try {
    const user = await User.findById(userId)
      .populate('achievements.achievementId', 'name description points')
      .select('achievements')
      .lean();

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const achievements = user.achievements.map(ach => ({
      achievementId: ach.achievementId._id,
      name: ach.achievementId.name,
      description: ach.achievementId.description,
      points: ach.achievementId.points,
      awardedAt: ach.awardedAt,
    }));

    await redisService.setCache(cacheKey, JSON.stringify(achievements), 3600); // Cache for 1 hour
    return achievements;
  } catch (error) {
    const err = error.status ? error : new Error('Failed to fetch user achievements');
    err.status = err.status || 500;
    throw err;
  }
};

/**
 * Award an achievement to a user
 * @param {string} userId - ID of the user
 * @param {string} achievementId - ID of the achievement
 * @returns {Promise<void>}
 * @throws {Error} If user or achievement not found, or already awarded
 */
const awardAchievement = async (userId, achievementId) => {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error('Invalid user ID');
    error.status = 400;
    throw error;
  }
  if (!mongoose.isValidObjectId(achievementId)) {
    const error = new Error('Invalid achievement ID');
    error.status = 400;
    throw error;
  }

  try {
    const [user, achievement] = await Promise.all([
      User.findById(userId),
      Achievement.findById(achievementId),
    ]);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    if (!achievement) {
      const error = new Error('Achievement not found');
      error.status = 404;
      throw error;
    }

    const hasAchievement = user.achievements.some(
      ach => ach.achievementId.toString() === achievementId
    );
    if (hasAchievement) {
      const error = new Error('Achievement already awarded');
      error.status = 400;
      throw error;
    }

    user.achievements.push({ achievementId });
    await user.save();

    // Invalidate user achievements cache
    await redisService.deleteCache(`user:${userId}:achievements`);
  } catch (error) {
    const err = error.status ? error : new Error('Failed to award achievement');
    err.status = err.status || 500;
    throw err;
  }
};

module.exports = { getAllAchievements, getUserAchievements, awardAchievement };