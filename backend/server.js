import dotenv from "dotenv";
import connectDB from "./db/db.js";
import redis from "./db/redis.js";
import app from "./app.js";

dotenv.config();
connectDB();


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});