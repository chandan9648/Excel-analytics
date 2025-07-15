import Upload from "../models/Upload.js";

export const getAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find().populate("user", "email");
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
};
