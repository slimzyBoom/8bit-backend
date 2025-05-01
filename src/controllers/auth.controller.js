const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const multiavatar = require('@multiavatar/multiavatar');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/user.model'); // Adjust the path as needed


// A helper function to generate a random avatar seed and produce the avatar SVG.
function generateRandomAvatar(username) {
  // Generate a seed using the username and current time (or any random component)
  const seed = username + Date.now();
  // multiavatar returns an SVG string based on the seed.
  return multiavatar(seed);
}

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists.'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Generate a random avatar for the new user
    const avatarSvg = generateRandomAvatar(username);

    // Create a new user with the generated avatar
    // Make sure your User model schema supports the "avatar" field.
    const newUser = await User.create({
      username,
      password: hashedPassword,
      avatar: avatarSvg
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `req.user` is populated by middleware

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

// Logout a user
exports.logoutUser = (req, res) => {
    try {
        // Invalidate the token on the client side (e.g., by removing it from storage)
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `req.user` is populated by middleware

        // Delete the user
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
};

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Forgot password 
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, you might want to send a generic message 
      // even if the user is not found.
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a password reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use the following token to reset your password. Note that this token expires in 15 minutes: ${resetToken}`,
      html: `<p>You requested a password reset. Use the following token to reset your password. Note that this token expires in 15 minutes:</p><p><strong>${resetToken}</strong></p>`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset token sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing forgot password', error: error.message });
  }
};