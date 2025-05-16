const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/validateRequest');

const validateAwardAchievement = [
  body('userId').isMongoId().withMessage('Invalid user ID'),
  body('achievementId').isMongoId().withMessage('Invalid achievement ID'),
];

const validateUserId = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
];

router.get('/', achievementController.getAllAchievements);
router.get(
  '/users/:userId',
  validateUserId,
  validate,
  authMiddleware,
  achievementController.getUserAchievements
);
router.post(
  '/award',
  authMiddleware,
  validateAwardAchievement,
  validate,
  achievementController.awardAchievement
);

module.exports = router;