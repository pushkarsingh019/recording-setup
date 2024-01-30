import express from "express"
import cors from "cors"
import {exec} from "child_process"
import mongoose from "mongoose"
import Trial from "./database.js";
import timeDifferenceInSeconds from "./calculateDifference.js";
import generateCsv from "./generateData.js";
import {Resend} from "resend";import fs from "fs/promises"
import getCurrentTime from "./time.js";

const app = express();
const PORT = process.env.PORT || 8000
app.use(cors())
app.use(express.json())
const database = "mongodb+srv://pushkar:fishrecording@cluster0.lz5tvs5.mongodb.net/recording"
// const database = "mongodb+srv://pushkar:pushkar@cluster0.jurgdiv.mongodb.net/test"
let trial = {}
const resend = new Resend("re_PhfK19tv_NMR9oecUvtgxu97z7PNwWEa6")

const createNewTrialData = async () => {
    const trialData = new Trial({
        stimulus : trial.stimulus,
        side : trial.side,
        startTiming : trial.startTiming,
        endTiming : trial.endTiming,
        reactionTime : trial.reactionTime,
        detection : trial.detection,
        signalProperty : trial.signalProperty
    });
    try {
        await trialData.save()
        trial = {}
    } catch (error) {
        console.log(error.message)
    }
};

const getSignal = (stimulus, detection) => {
    if(stimulus === "positive" && detection === "correct detection"){
        return "hit"
    } else if (stimulus === "negative" && detection === "correct detection"){
        return "false alarm"
    } else if (stimulus === "positive" && detection === "wrong detection"){
        return "miss"
    } else if (stimulus === "negative" && detection === "wrong detection"){
        return "correct rejection"
    } else if (detection === "null"){
        return "null"
    } else {
        return "error"
    }
};

const sendEmail = async () => {
    const host = "https://recording-setup-production.up.railway.app//";
    let link = host + "data"
    const { data, error } = await resend.batch.send([{
        from: "Pushkar Singh <pushkar@contact.stoicpushkar.com>",
        to: ["pushkars423@gmail.com"],
        subject: "Here is your data...",
        html: `<h1> Here is your data </h1> <br /> <a href=${link} target="_blank">click to download your data</a>`,
      }, {
        from: "Pushkar Singh <pushkar@contact.stoicpushkar.com>",
        to: ["vanshika.m@ahduni.edu.in"],
        subject: "Here is your data...",
        html: `<h1> Here is your data </h1> <br /> <a href=${link} target="_blank">click to download your data</a>`,
      }, {
        from: "Pushkar Singh <pushkar@contact.stoicpushkar.com>",
        to: ["sridharshiny.k@ahduni.edu.in"],
        subject: "Here is your data...",
        html: `<h1> Here is your data </h1> <br /> <a href=${link} target="_blank">click to download your data</a>`,
      }]);
    
      if (error) {
        console.log(error.message)
      }
}

app.get('/', (req, res) => {
    sendEmail()
    res.send("The recording setup.")
});

app.get('/stimulus/:stimuli', (req, res) => {
    const {stimuli} = req.params
    if(stimuli == 0){
        trial.stimulus = "negative"
    } else if(stimuli == 1){
        trial.stimulus = "positive"
    }
    else {
        console.log("option not recognised")
    }
    res.send(trial)
});

app.get('/side/:side', (req, res) => {
    const {side} = req.params;
    // 0 -> left side
    // 1 -> right side
    if (side == 0) {
        trial.side = "left"
    } else if (side == 1){
        trial.side = "right"
    } else {
        console.log("wrong option")
    }
    res.send(trial)
})

app.get('/start', (req, res) => {
    // exec(`python3 time.py`, (error, stdout, stderr) => {
    //     if(error){
    //         console.log(error.message);
    //     }
    //     if(stderr){
    //         console.log(`stderr ${stderr}`)
    //     }
    //     // console.log(stdout)
    //     trial.startTiming = stdout
    // })
    const startTime = getCurrentTime();
    trial.startTiming = startTime;
    res.send("starting trial");
});

app.get('/end', async (req, res) => {
    // exec(`python3 time.py`, (error, stdout, stderr) => {
    //     if(error){
    //         console.log(error.message);
    //     }
    //     if(stderr){
    //         console.log(`stderr ${stderr}`)
    //     }
    //     trial.endTiming = stdout
        
    // });
    const endTiming = getCurrentTime();
    trial.endTiming  = endTiming;
    const timeDifference = timeDifferenceInSeconds(trial.startTiming, trial.endTiming);
    trial.reactionTime = timeDifference;
    res.send("Got the end trial details....");
});

app.get('/discard', (req, res) => {
    trial = {}
    res.json("trial discarded");
});

app.get('/detection/:detect', (req, res) => {
    const {detect} = req.params
    // 0 -> wrong detection
    // 1 -> correct detection
    // 2 -> no detection
    if (detect == 0) {
        trial.detection = "wrong detection"
    } else if (detect == 1){
        trial.detection = "correct detection"
    } else if (detect == 2) {
        trial.detection = "null"
    } else {
        console.log("wrong detection option")
    }
    let signalProperty = getSignal(trial.stimulus, trial.detection);
    trial.signalProperty = signalProperty;
    console.log(trial);
    createNewTrialData()
    trial = {}
    res.send("done");
});

app.get('/data', async (req, res) => {
    try {
        const data = await Trial.find()
        const filePath = await generateCsv(data);

        // Sending the file for download
        res.download(filePath, 'final_data.csv', (err) => {
            if (err) {
                res.status(404).send('File not found');
            } else {
                console.log('File sent:', 'final_data.csv');
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/stop', (req, res) => {
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
    mongoose.connect(database)
    .then(() => console.log("database connected..."))
    .catch((error) => console.log(error.message));
})
