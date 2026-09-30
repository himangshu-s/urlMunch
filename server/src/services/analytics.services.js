import { addClickEventToQueue } from "../queues/analytics.queue.js";

const recordClickEvent = async (shortCode) => {
  const clickEvent = {
    shortCode,
    timestamp: new Date(),
  };

  await addClickEventToQueue(clickEvent);
};

export { recordClickEvent };