// Routes of all sources
import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { getUserCount, getUserStats, getLoggedInUserCount } from '../controllers/authController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// ✅ Total users
router.get("/users-count", protect, isAdmin, getUserCount);
router.get("/user-stats", getUserStats);



router.get("/loggedin-count", protect, isAdmin, getLoggedInUserCount);

export default router;