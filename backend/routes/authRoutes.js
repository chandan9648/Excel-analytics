import express from 'express';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Signup & Login
router.post('/signup', signup);
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Optional: verify token exists
router.get('/reset-password/:token', async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });
  res.status(200).json({ message: "Valid token" });
});

// Reset password
router.put('/reset-password/:token', resetPassword);

export default router;
