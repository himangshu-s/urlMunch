# What we have now

Currently the redirect does roughly:

Request
  ↓
Redis
  ↓
MongoDB (on cache miss)
  ↓
Redirect

And separately we have:

Click event
  ↓
Redis Queue
  ↓
Worker
  ↓
MongoDB

Now we'll combine them:

                 GET /abc123
                      │
                      ▼
                  Redis Cache
                   │       │
                 HIT      MISS
                   │       │
                   │    MongoDB
                   │       │
                   └───┬───┘
                       │
                       ▼
                 Add click event
                       │
                       ▼
                 Redirect NOW
                       │
                       │
                Redis Queue
                       │
                       ▼
                  Worker
                       │
                       ▼
                ClickEvent DB

The key idea is:

The redirect must not wait for the analytics database write.


# One thing to notice

You might be thinking:

"Wait, await recordClickEvent() still waits!"

That's a very good observation.

And yes — technically it does wait for the queue operation to complete.

But compare what we're waiting for:

Before:

Redirect request
      ↓
MongoDB write
      ↓
wait for database
      ↓
redirect

Now:

Redirect request
      ↓
Redis queue operation
      ↓
redirect

We're only waiting for a very fast Redis operation, not the analytics MongoDB write.

The worker handles MongoDB separately.