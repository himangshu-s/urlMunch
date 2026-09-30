 Perfect. 🎯 At this point, the basic URL-management layer is complete.

Now we're going to shift from CRUD into the part that actually makes urlMunch a scalable backend project.

Next: Fix the redirect architecture before adding Redis

Our current redirect flow is:

GET /abc123
      ↓
MongoDB findOne()
      ↓
Check expiration
      ↓
clicks += 1
      ↓
MongoDB save()
      ↓
Redirect

There are two problems here.

Problem 1 — Every redirect hits MongoDB

A URL shortener is fundamentally read-heavy.

If:

abc123 → https://example.com

gets opened 100,000 times, we're currently asking MongoDB to perform roughly 100,000 lookups.

That's exactly the kind of workload where caching helps.

Problem 2 — Every redirect writes to MongoDB

This part is even more problematic:

url.clicks += 1;
await url.save();

Imagine 10,000 redirects happening around the same time.

We're doing:

10,000 reads
+
10,000 writes

on the redirect path.

That's not something we want when our goal is high-volume redirects.

So our architecture will evolve

Eventually:

                 GET /abc123
                      ↓
                ┌───────────┐
                │   Redis   │
                └─────┬─────┘
                      │
                cache hit?
                 /         \
               YES          NO
                ↓            ↓
          Get original     MongoDB
             URL             ↓
                ↓        Store in Redis
                │            ↓
                └──────┬─────┘
                       ↓
                    Redirect
                       ↓
              Async analytics

The key idea is:

The redirect path should be extremely cheap.

We don't want the user waiting for analytics, click aggregation, etc.

But before Redis, one architectural change

We should separate:

URL resolution
shortCode → URL

from:

Analytics
shortCode → click event

Right now they're coupled because this happens inside the redirect request:

url.clicks += 1;
await url.save();

Eventually we'll change this to something like:

Redirect request
      ↓
Resolve URL
      ↓
Redirect immediately
      ↓
Analytics event
      ↓
Queue / worker
      ↓
Update analytics

That will let us handle analytics asynchronously.

But don't change the code yet

I want you to understand the architecture before we introduce Redis.

Our next step is to create a small cache abstraction/service, rather than sprinkling Redis commands directly throughout controllers.

We'll eventually have something conceptually like:

redirect.controller
       ↓
redirect service
       ↓
cache service
       ↓
Redis
       ↓
MongoDB on cache miss

That keeps Redis-specific logic isolated and makes the system easier to maintain.

Next step

We'll install and configure Redis locally, verify the connection, and create:

src/config/redis.js

Then we'll test Redis independently before touching the redirect logic.

That way, if something breaks, we know whether the problem is Redis or our redirect implementation.







# Next: Redis cache invalidation

Right now there's one important consistency problem:

Create URL
   ↓
MongoDB
   ↓
Redirect
   ↓
Redis stores originalUrl

But imagine:

Redis:
url:abc123 → https://google.com

        ↓
You update the URL

MongoDB:
url:abc123 → https://youtube.com

Redis:
url:abc123 → https://google.com  ❌

A redirect could therefore return the old URL until the Redis TTL expires.

The same problem exists with deletion.

What we'll implement now

For Update:

PATCH /api/urls/:id
        ↓
Update MongoDB
        ↓
Delete Redis cache
        ↓
Next redirect → MongoDB → Redis gets fresh value

For Delete:

DELETE /api/urls/:id
        ↓
Delete MongoDB
        ↓
Delete Redis cache
        ↓
Future redirect → 404

This is called cache invalidation, and it's an important part of using Redis correctly.


# Redis failure handling.
Right now, our architecture assumes Redis is available:

Request
   ↓
Redis
   ↓
MongoDB

But Redis is a cache, not our source of truth. If Redis crashes, urlMunch should still work.

What we want

If Redis is healthy:

Redirect
   ↓
Redis HIT ─────────→ Redirect
   │
   └─ MISS → MongoDB → Redis → Redirect

If Redis is down:

Redirect
   ↓
Redis fails
   ↓
MongoDB
   ↓
Redirect

The user should not receive a 500 error just because our cache is unavailable.




# Redis Cache
    ↓
Stores data temporarily for FAST READS

# Redis Queue
    ↓
Stores WORK that needs to be processed