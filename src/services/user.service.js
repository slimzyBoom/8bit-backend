const User = require("../models/User");

const getUserById = async (userId) => {
  return await User.findById(userId).select("-password");
};

const updateUserById = async (userId, updates) => {
  return await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");
};

module.exports = {
  getUserById,
  updateUserById,
};
