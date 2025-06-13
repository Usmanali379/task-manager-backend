// middleware/authMiddleware.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect – verifies JWT and attaches the user (without password) to req.user
 */
const protect = async (req, res, next) => {
  let token;

  // Expect header:  Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (minus password) to request
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ message: 'Not authorized: token invalid' });
    }
  }

  // No token present
  return res.status(401).json({ message: 'Not authorized: token missing' });
};

/**
 * adminOnly – allows access only if req.user.role === 'admin'
 * (Must be used AFTER protect middleware)
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: admins only' });
};

module.exports = { protect, adminOnly };
