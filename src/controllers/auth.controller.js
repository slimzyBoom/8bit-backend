import { NODE_ENV, JWT_SECRET } from "../config/env.config.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser } from "../services/auth.service.js";

// Handle user registration and session generation 
export const register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existing_user = await User.findOne({ username }).exec();
    if (existing_user) {
      return res.status(400).json({ error: "Username already exists", success: false });
    }

    const hashed_password = await bcrypt.hash(password, 10);
    const new_user = await createUser({
      username,
      password: hashed_password,
      email
    });
    const token = jwt.sign({ id: new_user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}`, success: false });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(400).json({ error: "Invalid username ", success: false });
    }
    const is_password_valid = await bcrypt.compare(password, user.password);
    if (!is_password_valid) {
      return res.status(400).json({ message: "Invalid password", success: false });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "Login successful", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}`, success: false });
  }
};

export const forgot_password = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await user.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};
