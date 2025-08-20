import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  parsedData: {
    type: Array,
    required: true,
  },
  user: {
  type: mongoose.Schema.Types.ObjectId, ref: "User"
  },

  status: {
    type: String,
    enum: ["success", "fail"],
    default: "success",
    required: true,
  },  
}, { timestamps: true });

const Upload = mongoose.model("Upload", uploadSchema);
export default Upload;
