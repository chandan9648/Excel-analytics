import express from "express";
import multer from "multer";
import { uploadExcel, deleteUpload,} from "../controllers/uploadController.js";
import { getUploadHistory } from "../controllers/uploadHistoryController.js";
import { protect } from "../middleware/authMiddleware.js";




const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", protect, upload.single("file"), uploadExcel);
router.get("/upload/history", protect, getUploadHistory);

router.delete("/upload/:id", protect, deleteUpload);
router.get("/upload/history", protect, getUploadHistory);

export default router;
