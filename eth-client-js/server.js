

const { response } = require('express');
const express = require('express');
const transaction = require("./transaction");
const app = express();

app.use(express.json());


app.post('/invoke', (req, res) => {

    key = req.body.args[0]
    value = req.body.args[1]

    transaction.set(key,value).then((result) => {
        res.send(result);
    }).catch(
        (error => {
             res.status(400).send({
               message: "error"
            });
        })
    )


  });


app.post('/write-queue', (req, res) => {

        transaction.writePendingQueueToFile()


    res.send("successful");
})


  app.listen(3000, () => console.log(' listening on port 3000.'));

