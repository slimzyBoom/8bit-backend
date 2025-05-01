const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/user.controller");

// Protected routes
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;
