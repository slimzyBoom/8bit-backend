const userService = require("../services/user.service");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = {};
    const { avatar, name } = req.body;

    if (avatar) updates.avatar = avatar;
    if (name) updates.name = name;

    const updatedUser = await userService.updateUserById(req.user._id, updates);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile." });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
