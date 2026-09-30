We don't want the redirect request to wait for:

MongoDB → create ClickEvent → finish

Instead:

Redirect
   ↓
Put event into queue
   ↓
Redirect immediately
          ↓
     Background worker
          ↓
       MongoDB
Step 3 — Choose our queue

Since we're already using Redis, we'll use Redis as the queue backend rather than adding RabbitMQ right now.

But there's an important distinction:

Redis Cache
    ↓
Stores data temporarily for FAST READS

Redis Queue
    ↓
Stores WORK that needs to be processed

Same Redis server, different purpose.

For example:

Cache:
url:abc123 → https://google.com

while our queue could contain:

click-event:
{
  shortCode: "abc123",
  timestamp: ...
}




# What's happening here?

This line:

await redisClient.rPush(...)

adds an item to a Redis list.

Think of the list as:

urlMunch:analytics

┌─────────────┬─────────────┬─────────────┐
│ click #1    │ click #2    │ click #3    │
└─────────────┴─────────────┴─────────────┘

rPush adds the new event to the right side:

Event 1
   ↓
[1]

Event 2
   ↓
[1] [2]

Event 3
   ↓
[1] [2] [3]

And:

JSON.stringify(clickEvent)

converts our JavaScript object into a string because Redis stores the queue item as data.

For example:

{
  shortCode: "abc123",
  timestamp: new Date()
}

becomes something like:

{"shortCode":"abc123","timestamp":"2026-09-30T15:30:00.000Z"}