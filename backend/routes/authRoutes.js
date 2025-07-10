// import express from 'express';
// import { signup, login } from '../controllers/authController.js';

// const router = express.Router();

// router.post('/signup', signup);
// router.post('/login', login);


// export default router;



// const express = require("express");
// const router = express.Router();

// // Dummy login route for now
// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   // You can add real logic later
//   if (email && password) {
//     return res.status(200).json({ token: "dummy-token", message: "Login successful" });
//   } else {
//     return res.status(400).json({ error: "Missing credentials" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // 3. Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
