import User from "../models/user.model.js";
import Nationalities from "../models/nationality.schema.js";
import Avatars from "../models/avatars.model.js";
import { updateUserService } from "../services/auth.service.js";

export const getUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).select(" -password ").exec();
    if (!user) {
      return res
        .status(404)
        .json({ error: "User is not found", success: false });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: `Internal server error: ${error.message}`,
        success: false,
      });
  }
};

export const updateUser = async (req, res) => {
  const { display_name, bio, nationality, avatar } = req.body;
  const { id } = req.user;
  try {
    const user = await updateUserService(id, {
      display_name,
      bio,
      nationality,
      avatar,
    });
    res.json({
      message: "User updated successfully ",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: `Internal server error: ${error.message}`,
        success: false,
      });
  }
};

export const getNationalites = async (req, res) => {
  try {
    const nationalities = await Nationalities.find().select("name -_id").exec();
    if (!nationalities) {
      return res
        .status(404)
        .json({ error: "Unable to fetch nationality", success: false });
    }
    res.json({ success: true, data: nationalities });
  } catch (error) {
    console.log("Internal Server error: ", error);
    res.status(500).json({ error: `Server error`, success: false });
  }
};

export const getAvatars = async (req, res) => {
  try {
    const avatars = await Avatars.find().exec();
    if (!avatars) {
      return res
        .status(404)
        .json({ error: "Unable to fetch avatars", success: false });
    }
    res.json({ success: true, data: avatars });
  } catch (error) {
    console.log("Internal Server error: ", error);
    res.status(500).json({ error: `Server error`, success: false });
  }
};
