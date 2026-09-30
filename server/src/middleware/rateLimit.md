# How this works in the middleware.

Suppose we configure:

{
  windowInSeconds: 60,
  maxRequests: 5,
  keyPrefix: "rate-limit:login"
}

For one IP, Redis creates:

rate-limit:login:<IP>

First request:

INCR → 1

Second:

INCR → 2

...

Sixth:

INCR → 6

Since:

6 > 5

we return:

429 Too Many Requests

The key automatically expires after 60 seconds.

One important design choice

Notice this:

catch (error) {
  console.error(...);
  next();
}

If Redis goes down, we're not blocking the API just because the rate limiter failed.

That's the same principle we used with caching:

Redis is an optimization/protection layer, not the source of truth for the application.