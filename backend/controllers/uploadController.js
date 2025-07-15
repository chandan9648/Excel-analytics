import xlsx from "xlsx";
import path from "path";

export const uploadExcel = async (req, res) => {
  try {
    const filePath = path.resolve("uploads", req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    await ExcelData.create({
      user: req.user.id,
      filename: req.file.originalname,
      parsedData: jsonData,
    });

    res.status(200).json({ msg: "File uploaded and data saved", data: jsonData });
  } catch (err) {
    res.status(500).json({ msg: "Upload failed", err });
  }
};
