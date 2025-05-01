const express = require('express');
const { registerUser, loginUser, logoutUser, deleteAccount, getProfile } = require('../controllers/auth.controller');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for user logout
router.post('/logout', logoutUser);

// Route for deleting user account
router.delete('/delete', deleteAccount);

// Route for fetching user profile
router.get('/profile', getProfile);

// Route for forgot password
router.post('/forgotpassword', (req, res) => {
    // Logic for handling forgot password
    res.send('Forgot password endpoint');
});

module.exports = router;