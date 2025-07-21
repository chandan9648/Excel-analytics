import express from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";


// In uploadRoutes.js
router.get("/all", protect, isAdmin, async (req, res) => {
  const allData = await ExcelData.find().populate("user", "email");
  res.json(allData);
});




const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", protect, upload.single("file"), uploadExcel);

export default router;
