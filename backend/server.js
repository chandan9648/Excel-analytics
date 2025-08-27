import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import insightRoutes from "./routes/insightRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load to env bars
dotenv.config();

// connect to DB
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);  /*route for signup/login*/


app.use("/api", uploadRoutes);  /*route for upload */

app.use("/api/admin", adminRoutes)
app.use("/api", insightRoutes);
app.use("/api", userRoutes);

 // Connect to MongoDB
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));