ur current redirect flow is:

GET /abc123
      ↓
MongoDB
      ↓
redirect



We're going to change it to:



GET /abc123
      ↓
Redis GET
      ↓
 ┌────┴────┐
 │         │
 HIT      MISS
 │         │
 ↓         ↓
URL      MongoDB
 │         ↓
 │      Redis SET
 │         │
 └────┬────┘
      ↓
   Redirect

This is called the cache-aside pattern.
But before modifying redirect.controller.js, we need to decide exactly what Redis will store.

We'll use:

key:
url:<shortCode>

value:
originalUrl

For example:

url:aB72xK
        ↓
https://example.com/some-long-url

This means a redirect doesn't need to deserialize an entire URL document just to find where to send the user.

One more important thing

We're not caching forever.

We'll give each cached URL a TTL, for example:

1 hour

So:

Redis:
url:aB72xK → https://example.com
             expires in 3600 seconds

This becomes important later when URLs are updated or deleted, because we'll need cache invalidation.