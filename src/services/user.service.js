const User = require('../models/User');

// Get user profile by ID
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Update user profile
const updateUserProfile = async (userId, updateData) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!updatedUser) {
    throw new Error('User not found');
  }
  return updatedUser;
};

// Get list of user's friends
const getFriendsList = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.friends;
};

// Get friend requests (if you track pending requests)
const getFriendRequests = async (userId) => {
  // Assuming you have a 'friendRequests' field or similar in the model
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user.friendRequests; // Modify based on your actual schema
};

// Send a friend request
const sendFriendRequest = async (userId, targetUserId) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new Error('User or target user not found');
  }

  // Logic for sending friend request (add to targetUser's friendRequests)
  targetUser.friendRequests.push(userId);
  await targetUser.save();

  return { message: 'Friend request sent' };
};

// Accept a friend request
const acceptFriendRequest = async (userId, requesterId) => {
  const user = await User.findById(userId);
  const requester = await User.findById(requesterId);

  if (!user || !requester) {
    throw new Error('User or requester not found');
  }

  // Remove from friendRequests and add to friends
  user.friendRequests = user.friendRequests.filter((id) => id !== requesterId);
  user.friends.push(requesterId);

  requester.friends.push(userId); // Add to requester’s friends
  await user.save();
  await requester.save();

  return { message: 'Friend request accepted' };
};

// Reject a friend request
const rejectFriendRequest = async (userId, requesterId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Remove from friendRequests
  user.friendRequests = user.friendRequests.filter((id) => id !== requesterId);
  await user.save();

  return { message: 'Friend request rejected' };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getFriendsList,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
