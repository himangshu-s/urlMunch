/*Request
   ↓
Rate-limit middleware
   ↓
Redis counter
   ↓
┌───────────────┐
│ Under limit?  │
└───────┬───────┘
    yes │ no
        │
        ▼
      API        429 Too Many Requests*/


import { redisClient } from "../config/redis.js";
import ApiError from "../utils/ApiError.js";

const rateLimit = ({
  windowInSeconds,
  maxRequests,
  keyPrefix,
}) => {
  return async (req, res, next) => {
    try {
      const identifier = req.ip;
      const key = `${keyPrefix}:${identifier}`;

      const currentCount = await redisClient.incr(key);

      if (currentCount === 1) {
        await redisClient.expire(
          key,
          windowInSeconds,
        );
      }

      const ttl = await redisClient.ttl(key);
      const remaining = Math.max(
        0,
        maxRequests - currentCount,
      );

      res.setHeader(
        "RateLimit-Limit",
        maxRequests,
      );

      res.setHeader(
        "RateLimit-Remaining",
        remaining,
      );

      res.setHeader(
        "RateLimit-Reset",
        ttl,
      );

      if (currentCount > maxRequests) {
        return next(
          new ApiError(
            429,
            "Too many requests. Please try again later.",
          ),
        );
      }

      next();
    } catch (error) {
      console.error(
        "Rate limiter failed:",
        error.message,
      );

      next();
    }
  };
};

export default rateLimit;

/* What the client now receives

Suppose the login limit is:

5 requests / 60 seconds

After the first request:

RateLimit-Limit: 5
RateLimit-Remaining: 4
RateLimit-Reset: 58

After the fifth:

RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 42

And the sixth gets:

429 Too Many Requests

This is useful because a frontend or API client can understand the current rate-limit state instead of just seeing a mysterious 429. */