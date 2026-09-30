import { redisClient } from "../config/redis.js";

const ANALYTICS_QUEUE = "urlMunch:analytics";
const ANALYTICS_DEAD_LETTER_QUEUE = "urlMunch:analytics:dead";

const addClickEventToQueue = async (clickEvent) => {
  await redisClient.rPush(
    ANALYTICS_QUEUE,
    JSON.stringify(clickEvent),
  );
};

const addClickEventToDeadLetterQueue = async (clickEvent) => {
  await redisClient.rPush(
    ANALYTICS_DEAD_LETTER_QUEUE,
    JSON.stringify(clickEvent),
  );
};

export {
  ANALYTICS_QUEUE,
  ANALYTICS_DEAD_LETTER_QUEUE,
  addClickEventToQueue,
  addClickEventToDeadLetterQueue,
};