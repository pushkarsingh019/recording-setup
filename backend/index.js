const express = require('express')
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 8000
app.use(cors())

app.get('/', (req, res) => {
    res.send("The recording setup.")
});

app.get('/start', (req, res) => {
    res.send("starting trial");
});

app.get('/end', (req, res) => {
    res.send("end trial");
})

app.listen(PORT, console.log('app is up and running..'))
