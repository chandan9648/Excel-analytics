// Routes of all sources
import express from 'express';
import { signup, login } from '../controllers/authController.js';



const router = express.Router();

// Signup route/ Login route
router.post('/signup', signup);
router.post('/login', login);


export default router;