import express from "express";
import cors from "cors";
import { exec } from "child_process";
import mongoose from "mongoose";
import Trial from "./database.js";
import timeDifferenceInSeconds from "./calculateDifference.js";
import generateCsv from "./generateData.js";
import { Resend } from "resend";
import getTrialData from "./getTrialData.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const database = "mongodb+srv://pushkars:akash-data@akash.f7x9qwg.mongodb.net/distance-discrimination"
let trial = {};
let fish;
let distance;
const resend = new Resend("re_PhfK19tv_NMR9oecUvtgxu97z7PNwWEa6");

const createNewTrialData = async () => {
  const trialData = new Trial({
    fish: trial.fish,
    distance : trial.distance,
    side: trial.side,
    startTiming: trial.startTiming,
    endTiming: trial.endTiming,
    reactionTime: trial.reactionTime,
    detection: trial.detection,
  });
  try {
    console.log(trialData);
    await trialData.save();
    trial = {};
  } catch (error) {
    console.log(error.message);
  }
};

app.get("/", (req, res) => {
  // sendEmail()
  res.send("The recording setup.");
});

app.get("/fishNumber/:fishNumber", (req, res) => {
  const { fishNumber } = req.params;
  fish = fishNumber;
  res.send(fish);
});

app.get("/distance/:stimuliDistance", (req, res) => {
  const {stimuliDistance} = req.params;
  distance = stimuliDistance;
  console.log(distance);
  res.send(distance);
})

app.get("/trialData", (req, res) => {
  trial = { fish: fish, distance : distance };
  const trialData = getTrialData();
  trial.stimulus = trialData.stimulus;
  trial.side = trialData.side;
  res.send(trialData);
});

app.get("/start", (req, res) => {
  exec(`python3 time.py`, (error, stdout, stderr) => {
    if (error) {
      console.log(error.message);
    }
    if (stderr) {
      console.log(`stderr ${stderr}`);
    }
    // console.log(stdout)
    trial.startTiming = stdout;
  });
  // const startTime = getCurrentTime();
  // trial.startTiming = startTime;
  res.send("starting trial");
});

app.get("/end", async (req, res) => {
  exec(`python3 time.py`, (error, stdout, stderr) => {
    if (error) {
      console.log(error.message);
    }
    if (stderr) {
      console.log(`stderr ${stderr}`);
    }
    trial.endTiming = stdout;
    const timeDifference = timeDifferenceInSeconds(
      trial.startTiming,
      trial.endTiming,
    );
    trial.reactionTime = timeDifference;
  });
  // const endTiming = getCurrentTime();
  // trial.endTiming  = endTiming;
  // console.log("start timing - end timing ", trial.startTiming, trial.endTiming)
  res.send("Got the end trial details....");
});

app.get("/discard", (req, res) => {
  trial = {};
  res.json("trial discarded");
});

app.get("/detection/:detect", (req, res) => {
  const { detect } = req.params;
  // 0 -> wrong detection
  // 1 -> correct detection
  // 2 -> no detection
  if (detect == 0) {
    trial.detection = "Wrong Detection";
  } else if (detect == 1) {
    trial.detection = "Correct Detection";
  } else if (detect == 2) {
    trial.detection = "null";
  } else {
    console.log("wrong detection option");
  }
  createNewTrialData();
  res.send("done");
});

app.get("/data", async (req, res) => {
  try {
    const data = await Trial.find();
    const filePath = await generateCsv(data);

    // Sending the file for download
    res.download(filePath, "data.csv", (err) => {
      if (err) {
        res.status(404).send("File not found");
      } else {
        console.log("File sent:", "data.csv");
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  mongoose
    .connect(database)
    .then(() => console.log("database connected..."))
    .catch((error) => console.log(error.message));
});
