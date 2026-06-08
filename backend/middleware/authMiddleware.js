// middleware/authMiddleware.js
// This runs before any protected route
// It checks if the user has a valid JWT token

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Token is sent in the header like: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user to the request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // allow to proceed to the route
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };