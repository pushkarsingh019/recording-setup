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
const database =
  "mongodb+srv://pushkar:fishrecording@cluster0.lz5tvs5.mongodb.net/recording";
// const database =
//   "mongodb+srv://pushkar:pushkar@cluster0.jurgdiv.mongodb.net/test";
let trial = {};
let fish;
const resend = new Resend("re_PhfK19tv_NMR9oecUvtgxu97z7PNwWEa6");

const createNewTrialData = async () => {
  const trialData = new Trial({
    fish: trial.fish,
    stimulus: trial.stimulus,
    side: trial.side,
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
  if (stimulus === "positive" && detection === "Detection") {
    return "hit";
  } else if (stimulus === "negative" && detection === "Detection") {
    return "false alarm";
  } else if (stimulus === "positive" && detection === "No Detection") {
    return "miss";
  } else if (stimulus === "negative" && detection === "No Detection") {
    return "correct rejection";
  } else if (detection === "null") {
    return "null";
  } else {
    return "error";
  }
};

const sendEmail = async () => {
  const host = "https://elfish.stoicpushkar.com/";
  let link = host + "data";
  const { data, error } = await resend.batch.send([
    {
      from: "Pushkar Singh <pushkar@contact.stoicpushkar.com>",
      to: ["pushkars423@gmail.com"],
      subject: "Here is your data...",
      html: `<h1> Here is your data </h1> <br /> <a href=${link} target="_blank">click to download your data</a>`,
    },
    {
      from: "Pushkar Singh <pushkar@contact.stoicpushkar.com>",
      to: ["vanshika.m@ahduni.edu.in"],
      subject: "Here is your data...",
      html: `<h1> Here is your data </h1> <br /> <a href=${link} target="_blank">click to download your data</a>`,
    },
    {
      from: "Pushkar Singh <pushkar@contact.stoicpushkar.com>",
      to: ["sridharshiny.k@ahduni.edu.in"],
      subject: "Here is your data...",
      html: `<h1> Here is your data </h1> <br /> <a href=${link} target="_blank">click to download your data</a>`,
    },
  ]);

  if (error) {
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

app.get("/trialData", (req, res) => {
  trial = { fish: fish };
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
