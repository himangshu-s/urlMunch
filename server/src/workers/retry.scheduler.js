import "dotenv/config";

import { redisClient } from "../config/redis.js";
import {
  ANALYTICS_RETRY_QUEUE,
  addClickEventToQueue,
} from "../queues/analytics.queue.js";

const RETRY_DELAY = 5000;

const startRetryScheduler = async () => {
  console.log("Analytics retry scheduler started");

  while (true) {
    const result = await redisClient.blPop(
      ANALYTICS_RETRY_QUEUE,
      0,
    );

    const clickEvent = JSON.parse(result.element);

    await new Promise((resolve) => {
      setTimeout(resolve, RETRY_DELAY);
    });

    await addClickEventToQueue(clickEvent);

    console.log(
      `Click event returned to main queue: ${clickEvent.shortCode}`,
    );
  }
};

startRetryScheduler();