const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController.js');

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
