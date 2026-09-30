import "dotenv/config";

import connectDatabase from "../config/database.js";
import { connectRedis } from "../config/redis.js";
import startAnalyticsWorker from "./analytics.worker.js";

const startWorker = async () => {
  try {
    await connectDatabase();
    await connectRedis();

    await startAnalyticsWorker();
  } catch (error) {
    console.error("Worker failed to start:", error.message);
    process.exit(1);
  }
};

startWorker();