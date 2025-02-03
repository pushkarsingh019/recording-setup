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
const database = "mongodb+srv://pushkars:cVIgCNgq1zmsiZjB@sri-cluster.ivbkc.mongodb.net/?retryWrites=true&w=majority&appName=sri-cluster"

let trial = {};
let fish;
let ball;
const resend = new Resend("re_PhfK19tv_NMR9oecUvtgxu97z7PNwWEa6");

const createNewTrialData = async () => {
  const trialData = new Trial({
    fish: trial.fish,
    ballSize : trial.ballSize,
    stimulus: trial.stimulus,
    distance : trial.distance,
    startTiming: trial.startTiming,
    endTiming: trial.endTiming,
    reactionTime: trial.reactionTime,
    detection: trial.detection,
    signalProperty: trial.signalProperty,
  });
  try {
    console.log(trialData);
    await trialData.save();
    trial = {};
  } catch (error) {
    console.log(error.message);
  }
};

const getSignal = (stimulus, detection) => {
  if (stimulus === "Yes" && detection === "Detection") {
    return "hit";
  } else if (stimulus === "No" && detection === "Detection") {
    return "false alarm";
  } else if (stimulus === "Yes" && detection === "No Detection") {
    return "miss";
  } else if (stimulus === "No" && detection === "No Detection") {
    return "correct rejection";
  } else if (detection === "null") {
    return "null";
  } else {
    return "error";
  }
};


app.get("/", (req, res) => {
  res.send("The recording setup.");
});

app.get("/fishNumber/:fishNumber", (req, res) => {
  const { fishNumber } = req.params;
  fish = fishNumber;
  res.send(fish);
});

app.get("/ballSize/:ballSize", (req, res) => {
  const { ballSize } = req.params;
  ball = ballSize
  res.send(ballSize);
});

app.get("/trialData", (req, res) => {
  trial.fish = fish
  trial.ballSize = ball
  const trialData = getTrialData();
  trial.stimulus = trialData.stimulus;
  trial.distance = trialData.distance;
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
    trial.startTiming = stdout;
  });
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

  res.send("Got the end trial details....");
});

app.get("/discard", (req, res) => {
  trial = {};
  res.json("trial discarded");
});

app.get("/detection/:detect", (req, res) => {
  const { detect } = req.params;
  // 0 -> FIS
  // 1 -> DETECTION0
  // 2 -> no detection
  if (detect == 0) {
    trial.detection = "No Detection";
  } else if (detect == 1) {
    trial.detection = "Detection";
  } else if (detect == 2) {
    trial.detection = "null";
  } else {
    console.log("wrong detection option");
  }
  let signalProperty = getSignal(trial.stimulus, trial.detection);
  trial.signalProperty = signalProperty;
  createNewTrialData();
  res.send("done");
});

app.get("/data", async (req, res) => {
  try {
    const data = await Trial.find();
    const filePath = await generateCsv(data);

    // Sending the file for download
    res.download(filePath, "final_data.csv", (err) => {
      if (err) {
        res.status(404).send("File not found");
      } else {
        console.log("File sent:", "final_data.csv");
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/stop", (req, res) => {
  exec(`./stop_camera.sh`, (error, stdout, stderr) => {
    if (error) {
      console.log(error.message);
      res.send("Error stopping picamera2 script");
    }
    if (stderr) {
      console.log(`stderr ${stderr}`);
      res.send("Error stopping picamera2 script");
    }
    res.send("Stopping picamera2 script...");
  });
});

app.listen(PORT, () => {
  mongoose
    .connect(database)
    .then(() => console.log("database connected..."))
    .catch((error) => console.log(error.message));
});
