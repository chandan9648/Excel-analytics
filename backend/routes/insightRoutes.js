import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getInsightSummary } from "../controllers/insightController.js";

const router = express.Router();

// Get an insight for a specific uploaded file
router.get("/insights/:uploadId", protect, getInsightSummary);

export default router;
