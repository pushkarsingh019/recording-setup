const express = require('express')
const cors = require('cors')
const {exec} = require('child_process')

const app = express();
const PORT = process.env.PORT || 8000
app.use(cors())

app.get('/', (req, res) => {
    res.send("The recording setup.")
});

app.get('/start', (req, res) => {
    exec(`python3 time.py`, (error, stdout, stderr) => {
        if(error){
            console.log(error.message);
        }
        if(stderr){
            console.log(`stderr ${stderr}`)
        }
        console.log(stdout)
    })
    res.send("starting trial");
});

app.get('/end', (req, res) => {
    exec(`python3 time.py`, (error, stdout, stderr) => {
        if(error){
            console.log(error.message);
        }
        if(stderr){
            console.log(`stderr ${stderr}`)
        }
        console.log(stdout)
    })
    res.send("end trial");
})

app.listen(PORT, console.log('app is up and running..'))
