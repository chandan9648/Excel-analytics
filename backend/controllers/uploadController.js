import xlsx from "xlsx";
import path from "path";
import fs from "fs";
import Upload from "../models/Upload.js";

export const uploadExcel = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve("uploads", req.file.filename);

    // Read Excel and convert to JSON
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Debug logs
    // console.log("📄 File received:", req.file.originalname);
    // console.log("👤 Uploaded by user ID:", req.user?.id);
    // console.log("✅ Rows parsed:", jsonData.length);

    // Save to database with status = success
    await Upload.create({
      user: req.user?.id || null,
      filename: req.file.originalname,
      parsedData: jsonData,
      status: "success",
    });

    // Delete file from uploads/
    fs.unlinkSync(filePath);

    return res.status(200).json({ 
      msg: "File uploaded and data parsed successfully",
      data: jsonData,
    });

  } catch (err) {
    console.error("❌ Upload Error:", err.message);

    try {
      await Upload.create({
        user: req.user?._id || null,
        filename: req.file?.originalname || "unknown",
        parsedData: [],
        status: "fail", // Save as failed
      });
    } catch (dbErr) {
      console.error("❌ Failed to log upload failure:", dbErr.message);
    }

    return res.status(500).json({
      message: "Upload failed",
      error: err.message,
    });
  }
};
