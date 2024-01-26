import mongoose from "mongoose"

const trialSchema = new mongoose.Schema({
    stimulus : String,
    side : String,
    startTiming : String,
    endTiming : String,
    reactionTime : String,
    detection : String,
    signalProperty : String,
});

const Trial = mongoose.model("Trial", trialSchema);

export default Trial