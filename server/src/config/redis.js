import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Redis connection failed:", error.message);
    process.exit(1);
  }
};

export { redisClient, connectRedis };

/* What's happening here?

We are creating one Redis client for our application:

const redisClient = createClient(...)

The URL:

redis://localhost:6379

means:

localhost → Redis is running on our Mac
6379     → Redis's default port

Then:

await redisClient.connect();

actually establishes the connection.  */