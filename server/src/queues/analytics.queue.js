import { redisClient } from "../config/redis.js";

const ANALYTICS_QUEUE = "urlMunch:analytics";
const ANALYTICS_RETRY_QUEUE = "urlMunch:analytics:retry";
const ANALYTICS_DEAD_LETTER_QUEUE = "urlMunch:analytics:dead";
const addClickEventToQueue = async (clickEvent) => {
  await redisClient.rPush(
    ANALYTICS_QUEUE,
    JSON.stringify(clickEvent),
  );
};

const addClickEventToRetryQueue = async (clickEvent) => {
  const retryEvent = {
    ...clickEvent,
    retryCount: (clickEvent.retryCount || 0) + 1,
  };

  await redisClient.rPush(
    ANALYTICS_RETRY_QUEUE,
    JSON.stringify(retryEvent),
  );
  /*Now an event can look like:

retryCount: 1

then:

retryCount: 2

etc. */
};

const addClickEventToDeadLetterQueue = async (clickEvent) => {
  await redisClient.rPush(
    ANALYTICS_DEAD_LETTER_QUEUE,
    JSON.stringify(clickEvent),
  );
};

export {
  ANALYTICS_QUEUE,
  ANALYTICS_RETRY_QUEUE,
  ANALYTICS_DEAD_LETTER_QUEUE,
  addClickEventToQueue,
  addClickEventToRetryQueue,
  addClickEventToDeadLetterQueue,
};

/* What did we add?

Previously we had only:

urlMunch:analytics

Now we have two queues:

urlMunch:analytics
        ↓
   normal events


urlMunch:analytics:retry
        ↓
   failed events

So conceptually:

             Click Event
                  │
                  ▼
          ┌───────────────┐
          │ Main Queue    │
          └───────┬───────┘
                  │
                Worker
                  │
           ┌──────┴──────┐
           │             │
         SUCCESS        FAIL
           │             │
           ▼             ▼
          Done       Retry Queue
          
          
          
          
          
          after chnages , finally its = 
          Main Queue
    ↓
MongoDB
    ↓
FAIL
    ↓
retryCount < limit?
   /       \
 yes        no
 ↓           ↓
Retry      Dead-letter*/