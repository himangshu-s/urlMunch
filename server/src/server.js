import "dotenv/config";
// import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";
import { connectRedis } from "./config/redis.js";
// dotenv.config(); this was giving error , so we chnaged it. 



const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDatabase();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`urlMunch server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();


/*currently we have = 
server.js
   ↓
MongoDB connects
   ↓
Redis connects
   ↓
Express starts */