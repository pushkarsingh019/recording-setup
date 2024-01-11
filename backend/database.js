import mongoose from "mongoose"

const trialSchema = new mongoose.Schema({
    startTiming : String,
    endTiming : String,
    reactionTime : Number,
});

const Trial = mongoose.model("Trial", trialSchema);

export default Trial