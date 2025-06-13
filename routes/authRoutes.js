const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

// ✅ Admin-only test route
router.get('/admin-check', protect, adminOnly, (req, res) => {
    res.json({ message: '✅ You are an admin!' });
});

module.exports = router;
