const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Protected example
router.get('/me', auth, getMe);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router;
