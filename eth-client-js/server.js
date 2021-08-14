

const { response } = require('express');
const express = require('express');
const transaction = require("./transaction");
const app = express();
app.use(express.json());


app.post('/invoke', (req, res) => {
    const start = new Date();
    key = req.body.args[0]
    value = req.body.args[1]

    transaction.set(key,value,start).then((result) => {
        res.send(result);
    }).catch(
        (error => {
            console.log(error)
             res.status(400).send({
               message: "error"
            });
        })
    )
    });


app.post('/write-queue', (req, res) => {

        transaction.writeQueueToFile()


    res.send("successful");
})


app.post('/latency', (req, res) => {

        transaction.calculateLatencyAVG()


    res.send("successful");
})


  app.listen(3000, () => console.log(' listening on port 3000.'));

