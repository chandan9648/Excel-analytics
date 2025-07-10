const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

function connectDB() {
  const dbURI = process.env.MONGO_URI;

  if (!dbURI) {
    console.error("MongoDB URI not found in environment variables.");
    process.exit(1); // Exit process with failure
  }



  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
}

module.exports = connectDB;
