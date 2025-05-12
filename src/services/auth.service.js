import User from "../models/user.model.js";
import Nationality from "../models/nationality.schema.js"

 export const createUser = async (credentials) => {
  const { username, password, email } = credentials;
  try {
    const new_user = await User.create({
      username,
      email,
      password,
    });
    return new_user;
  } catch (error) {
    console.error("Error creating user: ", error.message);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user: ", error.message);
    throw error;
  }
};

export const updateUserService = async (id, updateData) => {
  try {
    const user = await User.findById(id).exec();
    if (!user) throw new Error("User not found");

    if (updateData.display_name) user.display_name = updateData.display_name;
    if (updateData.bio) user.bio = updateData.bio;
    if (updateData.avatar) user.avatar = updateData.avatar;

    if (updateData.nationality) {
      const nation = await Nationality.findOne({ name: updateData.nationality })
        .select("-_id")
        .exec();
      if (nation) user.nationality = nation;
    }

    await user.save();
    return user;
  } catch (error) {
    console.log("Error updating user: ", error);
    throw error;
  }
};
