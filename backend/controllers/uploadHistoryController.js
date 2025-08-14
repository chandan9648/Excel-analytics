import Upload from "../models/Upload.js";

export const getUploadHistory = async (req, res) => {
  try {
    // console.log("Decode user", req.user);
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(uploads);
  } catch (err) {
    console.error("Failed history error:", err);
    res.status(500).json({ msg: "Failed to fetch upload history" });
  }
};
