const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const user = require("./models/User");

// Load env bars
dotenv.config();


// connect to DB
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require("./middleware/auth");
app.use("/api/auth", authRoutes);


app.get("/",(req, res)=>{
  res.send("Server connected")
})

  // Route to insert user
app.post("/api/users", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Received data", req.body);

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: " User saved", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server
app.listen(5000, () =>
   console.log("Server running on port" ));