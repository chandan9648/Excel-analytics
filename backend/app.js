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

const allowedOrigins = ["https://excel-analytics-2004.netlify.app",
    "http://localhost:5173"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,

}));


app.use(express.json());


// API routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", insightRoutes);
app.use("/api", userRoutes);

export default app;
