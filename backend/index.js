import express from "express"
import cors from "cors"
import {exec} from "child_process"
import mongoose from "mongoose"
import Trial from "./database.js";
import timeDifferenceInSeconds from "./calculateDifference.js";
import generateCsv from "./generateData.js";

const app = express();
const PORT = process.env.PORT || 8000
app.use(cors())

const database = "mongodb+srv://pushkar:fishrecording@cluster0.lz5tvs5.mongodb.net/recording"
const trial = {}

app.get('/', (req, res) => {
    res.send("The recording setup.")
});

app.get('/start', (req, res) => {
    exec(`python time.py`, (error, stdout, stderr) => {
        if(error){
            console.log(error.message);
        }
        if(stderr){
            console.log(`stderr ${stderr}`)
        }
        // console.log(stdout)
        trial.startTiming = stdout
    })
    res.send("starting trial");
});

app.get('/end', (req, res) => {
    exec(`python time.py`, (error, stdout, stderr) => {
        if(error){
            console.log(error.message);
        }
        if(stderr){
            console.log(`stderr ${stderr}`)
        }
        // console.log(stdout)
        trial.endTiming = stdout
        const reactionTime = timeDifferenceInSeconds(trial.startTiming, trial.endTiming);
        const newTrial = new Trial({
            startTiming : trial.startTiming,
            endTiming : trial.endTiming,
            reactionTime : reactionTime
        });
        newTrial.save()
    })
    res.send("end trial");
});

app.get('/data', async (req, res) => {
    try {
        const data = await Trial.find()
        generateCsv(data)
    } catch (error) {
        res.send(error.message)
    }
    res.send("here you go with your csv file")
})

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
