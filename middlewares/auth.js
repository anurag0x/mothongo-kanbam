const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
require("dotenv").config()

// Middleware for authentication using JWT
const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization').split(" ");
    // Check if token is in Bearer format
    if (token[0] != "Bearer") return res.status(401).json({ message: 'Invalid Token format', isOk: false });
    // Verify and decode the token
    const decoded = jwt.verify(token[1], process.env.JWT);

    // Find user based on decoded userId
    const user = await User.findOne({ _id: decoded.userId });

    // If user not found, return invalid token
    if (!user) {
      res.status(401).json({ message: 'Invalid Token format', isOk: false });
    }

    // Set user information in request object
    req.user = decoded;
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Handle authentication failure
    return res.status(401).json({ message: 'Authentication failed', isOk: false });
  }
};

module.exports = { auth }
