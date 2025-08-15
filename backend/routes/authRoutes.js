import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signup, login, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

// Signup & Login
router.post('/signup', signup);
router.post('/login', login);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Verify token before showing reset form
router.get('/reset-password/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Valid token" });
  } catch {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { password: hashed },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

export default router;
