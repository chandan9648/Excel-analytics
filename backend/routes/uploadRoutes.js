import express from "express";
import multer from "multer";
import { uploadExcel } from "../controllers/uploadController.js";
// import { protect } from "../middleware/authMiddleware.js";




const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload",/* protect,*/ upload.single("file"), uploadExcel);

export default router;
