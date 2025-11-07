import dotenv from "dotenv";
import connectDB from "./db/db.js";
import redis from "./db/redis.js";
import app from "./app.js";
import keepServerAlive from "./keepAlive.js";

dotenv.config();
connectDB();


app.listen(5000, () => {
    console.log("Server is running on port 5000");
    keepServerAlive();
});