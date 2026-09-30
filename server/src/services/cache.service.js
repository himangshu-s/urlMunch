/* Why?

We don't want our controller filled with Redis-specific commands like:

redisClient.get(...)
redisClient.set(...)
redisClient.del(...) */


import { redisClient } from "../config/redis.js";

const getCache = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error("Redis GET failed:", error.message);
    return null;
  }
};

const setCache = async (key, value, expirationInSeconds) => {
  try {
    await redisClient.set(key, value, {
      EX: expirationInSeconds,
    });
  } catch (error) {
    console.error("Redis SET failed:", error.message);
  }
};

const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis DELETE failed:", error.message);
  }
};

export {
  getCache,
  setCache,
  deleteCache,
};

/* For example:

await setCache(
  "url:abc123",
  "https://example.com",
  3600,
);

Redis will store:

url:abc123 → https://example.com

for one hour.

One important detail

We're storing the original URL as a string, not the entire Mongoose document.
The redirect only fundamentally needs:

shortCode → originalUrl

That keeps the cache small and fast.

# Why getCache() returns null

Our redirect controller already does:

let originalUrl = await getCache(cacheKey);

if (originalUrl) {
  return res.redirect(originalUrl);
}

So if Redis fails:

getCache()
   ↓
Redis error
   ↓
return null
   ↓
controller thinks it's a cache miss
   ↓
MongoDB

That's exactly what we want.

Redis becomes an optimization rather than a dependency.


*/