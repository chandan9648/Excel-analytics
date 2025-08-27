import User from "../models/User.js";
import Upload from "../models/Upload.js";

// GET /api/user/me
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email role createdAt lastLogin");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user  (name, email, password?)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email.toLowerCase() !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists && String(exists._id) !== String(user._id)) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }
    if (name) user.name = name;
    if (password && password.trim().length > 0) {
      user.password = password; // will be hashed by pre-save hook
    }

    await user.save();
    res.json({ message: "Profile updated", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/user
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    await Upload.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: "Account and data deleted" });
  } catch (err) {
    console.error("deleteAccount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
