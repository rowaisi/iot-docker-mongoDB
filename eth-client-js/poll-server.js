

const { response } = require('express');
const express = require('express');
const poll = require("./poll")
const app = express();
app.use(express.json());



app.get('/queue', (req, res) => {
    const queue = poll.getlatencyTX()
    res.send(queue);
})

app.post('/write-queue', (req, res) => {
    const type = req.body.type


        poll.writeReceviedQueueToFile()


    res.send("successful");
})

app.post('/latency', (req, res) => {

   // const start = req.body.start
   // const end = req.body.end
    //poll.pollBlockInRange(start,end)
    poll.calculateLatency()
    res.send("successful");

  });

  app.listen(3001, () => console.log(' listening on port 3001.'));

