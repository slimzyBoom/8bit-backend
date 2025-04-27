const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Get current user's profile
router.get('/me', userController.getMe);

// Update current user's profile
router.put('/me', userController.updateMe);

// Get list of friends
router.get('/friends', userController.getFriends);

// Get friend requests
router.get('/friends/requests', userController.getFriendRequests);

// Send a friend request
router.post('/friends/request/:id', userController.sendFriendRequest);

// Accept a friend request
router.post('/friends/accept/:id', userController.acceptFriendRequest);

// Reject a friend request
router.post('/friends/reject/:id', userController.rejectFriendRequest);

module.exports = router;
