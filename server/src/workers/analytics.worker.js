import { redisClient } from "../config/redis.js";
import {
  ANALYTICS_QUEUE,
  ANALYTICS_RETRY_QUEUE,
  addClickEventToRetryQueue,
  addClickEventToDeadLetterQueue,
} from "../queues/analytics.queue.js";
import ClickEvent from "../models/clickEvent.model.js";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const processClickEvent = async (clickEvent) => {
  try {
    await ClickEvent.create(clickEvent);

    console.log(
      `Click event processed: ${clickEvent.shortCode}`,
    );
  } catch (error) {
    console.error(
      `Failed to process click event: ${clickEvent.shortCode}`,
      error.message,
    );

    if ((clickEvent.retryCount || 0) < MAX_RETRIES) {
      await addClickEventToRetryQueue(clickEvent);

      console.log(
        `Click event moved to retry queue: ${clickEvent.shortCode}`,
      );
    } else {
      await addClickEventToDeadLetterQueue(clickEvent);

      console.error(
        `Click event moved to dead-letter queue: ${clickEvent.shortCode}`,
      );
    }
  }
};

const startAnalyticsWorker = async () => {
  console.log("Analytics worker started");

  while (true) {
    const result = await redisClient.blPop(
      ANALYTICS_QUEUE,
      0,
    );

    const clickEvent = JSON.parse(result.element);

    await processClickEvent(clickEvent);
  }
};

export default startAnalyticsWorker;


/* finally the worker consume both the main queue and retry queue, but we need to do it carefully. 

also -
We don't want this:

MongoDB fails
   ↓
Retry queue
   ↓
immediately retry
   ↓
MongoDB fails
   ↓
retry
   ↓
retry
   ↓
💥

Instead, we'll give retries a small delay.

*/