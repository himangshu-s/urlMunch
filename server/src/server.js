import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";

dotenv.config();


const PORT = process.env.PORT || 8000;


const startServer= async() =>{
    try{
        await connectDatabase();
          app.listen(PORT, () => {
      console.log(`urlMunch server is running on port ${PORT}`);
    });
    }

catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();