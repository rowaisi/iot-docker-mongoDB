

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

app.post('/write-queue', (req, res) => {
    const type = req.body.type
    if (type === "send"){
        transaction.writePendingQueueToFile()
    } else if (type === "received") {
        poll.writePendingQueueToFile()
    }

    res.send("successful");
})

app.post('/latency', (req, res) => {

   // const start = req.body.start
   // const end = req.body.end
    //poll.pollBlockInRange(start,end)
    poll.calculateLatency()
    res.send("successful");

  });

  app.listen(3000, () => console.log(' listening on port 3000.'));

