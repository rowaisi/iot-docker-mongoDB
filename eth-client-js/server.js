

const { response } = require('express');
const express = require('express');
const transaction = require("./transaction");
const poll = require("./poll")
const app = express();
app.use(express.json());


app.post('/invoke', (req, res) => {

    key = req.body.args[0]
    value = req.body.args[1]

    transaction.set(key,value)
    res.send("successful");

  });

app.get('/queue', (req, res) => {
    const queue = poll.getlatencyTX()
    res.send(queue);
})

app.get('/write-queue', (req, res) => {
    transaction.writePendingQueueToFile()
    res.send("successful");
})

app.post('/latency', (req, res) => {

    const start = req.body.start
    const end = req.body.end
    poll.pollBlockInRange(start,end)

    res.send("successful");

  });

  app.listen(3000, () => console.log(' listening on port 3000.'));

