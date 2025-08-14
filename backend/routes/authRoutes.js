// Routes of all sources
import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { forgotPassword, resetPassword } from "../controllers/authController.js"



const router = express.Router();

// Signup route/ Login route
router.post('/signup', signup);
router.post('/login', login);

// forgot and reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;