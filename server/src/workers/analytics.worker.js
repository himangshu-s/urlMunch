import { redisClient } from "../config/redis.js";
import {
  ANALYTICS_QUEUE,
  addClickEventToDeadLetterQueue,
} from "../queues/analytics.queue.js";
import ClickEvent from "../models/clickEvent.model.js";

const MAX_RETRIES = 3;

const processClickEvent = async (clickEvent) => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await ClickEvent.create(clickEvent);

      console.log(
        `Click event processed: ${clickEvent.shortCode}`,
      );

      return;
    } catch (error) {
      console.error(
        `Failed to process click event: ${clickEvent.shortCode} | Attempt ${attempt}`,
        error.message,
      );

      if (attempt === MAX_RETRIES) {
        await addClickEventToDeadLetterQueue({
          ...clickEvent,
          failedAfterAttempts: MAX_RETRIES,
        });

        console.error(
          `Click event moved to dead-letter queue: ${clickEvent.shortCode}`,
        );
      }
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

/*.Now our architecture is much cleaner
                 Main Queue
                     │
                     ▼
                   Worker
                     │
                  MongoDB
                 /       \
              success    failure
                │           │
                ▼           ▼
              Done      retry × 3
                            │
                            ▼
                     Dead-letter Queue

No scheduler. No second retry queue. No delayed-job machinery. */