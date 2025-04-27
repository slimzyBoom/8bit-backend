const userService = require('../services/user');

// Get current user's profile
const getMe = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id); // Assuming you use JWT for user ID
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update current user's profile
const updateMe = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get list of friends
const getFriends = async (req, res) => {
  try {
    const friends = await userService.getFriendsList(req.user.id);
    res.status(200).json(friends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get friend requests
const getFriendRequests = async (req, res) => {
  try {
    const requests = await userService.getFriendRequests(req.user.id);
    res.status(200).json(requests);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const response = await userService.sendFriendRequest(req.user.id, req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const response = await userService.acceptFriendRequest(req.user.id, req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  try {
    const response = await userService.rejectFriendRequest(req.user.id, req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMe,
  updateMe,
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
