import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
  const dbURI = process.env.MONGO_URI;

  if (!dbURI) {
    console.error("MongoDB URI not found in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB✅");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

export default connectDB;
