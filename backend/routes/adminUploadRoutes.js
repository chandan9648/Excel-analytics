import express from "express";
import { getAllUploads } from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", protect, isAdmin, getAllUploads);

export default router;
