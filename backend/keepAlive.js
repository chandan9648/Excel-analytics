// keepAlive.js
import axios from "axios";

const BACKEND_URL = "https://excel-analytics-platform-z594.onrender.com"; 

const keepServerAlive = () => {
  setInterval(async () => {
    try {
      await axios.get(BACKEND_URL);
      console.log(" Server ping successful");
    } catch (error) {
      console.log("Server ping failed:", error.message);
    }
  }, 5 * 60 * 1000); // every 5 minutes
};

export default keepServerAlive;
