import xlsx from "xlsx";
import path from "path";
import ExcelData from "../models/ExcelData.js"; // Optional model

export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve("uploads", req.file.filename);

    // Read and convert Excel to JSON
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Optional: Save to database
    // await ExcelData.create({
    //   user: req.user?.id || null,
    //   filename: req.file.originalname,
    //   parsedData: jsonData,
    // });

    // ✅ Send only one response
    return res.status(200).json({
      msg: "File uploaded and data parsed successfully",
      data: jsonData,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({
      message: "Upload failed",
      error: err.message,
    });
  }
};
