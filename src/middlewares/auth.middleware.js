const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed." });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token." });
};

module.exports = protect;
