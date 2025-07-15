import mongoose from "mongoose";

const excelDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  parsedData: Array,
}, { timestamps: true });

export default mongoose.model("ExcelData", excelDataSchema);
