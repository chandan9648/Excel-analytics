import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminUploadRoutes from "./routes/adminUploadRoutes.js";

// Load env bars
dotenv.config();


// connect to DB
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/api/upload", adminUploadRoutes); // reuse "/upload/all"


 // Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server is running on port: ${process.env.PORT || 5000}`)
  );
})
.catch(err => console.log("MongoDB connection error:", err));