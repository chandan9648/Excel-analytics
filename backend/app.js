import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();


app.use(cors({
    origin: "https://excel-analytics2d3d.vercel.app",
    credentials: true
}));
app.use(express.json());


// API routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", insightRoutes);
app.use("/api", userRoutes);

export default app;
