import User from "../models/user.model.js";

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
  const sanitizedObject = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  )
  return updatedObject = await User.findByIdAndUpdate(id, sanitizedObject, { new: true })
 } catch (error) {
  console.log("Error updating user: ", error);
  throw error;
 }
}