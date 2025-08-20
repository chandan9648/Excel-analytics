// // import Upload from "../models/Upload.js";

// // export const getAllUploads = async (req, res) => {
// //   try {
// //     const uploads = await Upload.find().populate("user", "email");
// //     res.json(uploads);
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server error", err });
// //   }
// // };


// import User  from '../models/User.js';
// import Upload from '../models/Upload.js';


// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password').populate('files').lean(); // Exclude passwords

//     res.json({ users});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     await Upload.deleteMany({ user: userId });
//     await User.findByIdAndDelete(userId);
//     res.json({ message: 'User and their files deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // adminController.js

// export const deleteUserFileByAdmin = async (req, res) => {
//  const { userId, fileId } = req.params;

//   try {
//     // Optional: Check if file belongs to userId
//     const file = await Upload.findOne({ _id: fileId, userId: userId });
//     if (!file) return res.status(404).json({ message: "File not found" });

//     await Upload.findByIdAndDelete(fileId);

//     res.status(200).json({ message: "File deleted successfully" });
//   } catch (error) {
//     console.error("Delete file error:", error);
//     res.status(500).json({ message: "Failed to delete file" });
//   }
// };


// export const getAllUsersWithFiles = async (req, res) => {
//   try {
//     const users = await User.find();

//     const usersWithFiles = await Promise.all(
//       users.map(async (user) => {
//         const files = await Upload.find({ userId: mongoose.Types.ObjectId(user._id) });
//         return { ...user.toObject(), files };
//       })
//     );

//     res.status(200).json({ users: usersWithFiles });
//   } catch (err) {
//     console.error("Error fetching users with files:", err);
//     res.status(500).json({ error: "Failed to fetch users" });
//   }
// };

// controllers/adminController.js
import mongoose from "mongoose";
import User from "../models/User.js";
import Upload from "../models/Upload.js";

export const getAllUsers = async (req, res) => {
  try {
    // Get basic user info
    const users = await User.find()
      .select("name email role") // avoid sending password
      .lean();

    // Aggregate counts of uploads per user
    const counts = await Upload.aggregate([
      { $group: { _id: "$user", totalFiles: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map(c => [c._id.toString(), c.totalFiles]));

    // Attach last 3 files for each user (lightweight)
    const usersWithCounts = await Promise.all(users.map(async (u) => {
      const files = await Upload.find({ user: u._id })
        .select("_id originalname createdAt")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        totalFiles: countMap[u._id.toString()] || 0,
        files, // recent files
      };
    }));

    // Return array (frontend expects array)
    res.json(usersWithCounts);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete DB entries
    await Upload.deleteMany({ user: userId });

    // (optional) Delete files from disk/storage if you store files physically — implement here

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User and their files deleted successfully' });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteUserFileByAdmin = async (req, res) => {
  try {
    const { userId, fileId } = req.params;

    // Ensure Upload model uses field `user` (not userId). Adjust if your model is different.
    const file = await Upload.findOne({ _id: fileId, user: userId });
    if (!file) return res.status(404).json({ message: "File not found" });

    // If file stored on disk/cloud, delete storage object here (fs.unlink or cloud SDK)
    await Upload.findByIdAndDelete(fileId);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};
