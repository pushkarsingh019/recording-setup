import mongoose from "mongoose";

const trialSchema = new mongoose.Schema({
  fish: {
    type: String,
    required: true,
  },
  stimulus: {
    type: String,
    required: true,
  },
  side: {
    type: String,
    required: true,
  },
  startTiming: {
    type: String,
    required: true,
  },
  endTiming: {
    type: String,
    required: true,
  },
  reactionTime: {
    type: String,
    required: true,
  },
  detection: {
    type: String,
    required: true,
  },
  signalProperty: {
    type: String,
    required: true,
  },
});

const Trial = mongoose.model("Trial", trialSchema);

export default Trial;
