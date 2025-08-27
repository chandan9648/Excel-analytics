import express from "express";
import { getProfile, updateProfile, deleteAccount } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user/me", protect, getProfile);
router.put("/user", protect, updateProfile);
router.delete("/user", protect, deleteAccount);

export default router;
