import mongoose from "mongoose";

const clickEventSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
);

const ClickEvent = mongoose.model("ClickEvent", clickEventSchema);

export default ClickEvent;

/*. With ClickEvent, every click can eventually become:

shortCode   timestamp
abc123      20:51:02
abc123      20:51:05
abc123      20:51:11
xyz789      20:52:03

Then we can answer things like:

How many clicks did abc123 receive today?
How many clicks did it receive this hour?
What was the traffic over time?*/