What's blPop() doing?

This is the key part:

await redisClient.blPop(ANALYTICS_QUEUE, 0);

BLPOP means Blocking Left Pop.

Imagine our queue:

Redis queue

[Event 1] [Event 2] [Event 3]
    ↑
  worker

The worker takes the oldest event from the left:

[Event 1] → Worker
[Event 2] [Event 3]

Then:

[Event 2] → Worker
[Event 3]

And so on.

The 0 means:

Wait indefinitely if the queue is empty.

So the worker doesn't continuously hammer Redis with requests:

❌ check
❌ check
❌ check
❌ check

Instead, Redis basically says:

"I'll wake you up when an event arrives."

That's very useful for a background worker.



# Why two files?

worker.js is the entry point:

worker.js
   ↓
connect MongoDB
   ↓
connect Redis
   ↓
start analytics worker

analytics.worker.js contains the actual worker logic:

Redis Queue
    ↓
BLPOP
    ↓
JSON.parse()
    ↓
ClickEvent.create()
    ↓
MongoDB

This separation is useful because later we can have several different workers:

workers/
├── worker.js
├── analytics.worker.js
├── email.worker.js
└── cleanup.worker.js