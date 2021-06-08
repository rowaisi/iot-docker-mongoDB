

const { response } = require('express');
const express = require('express');
const transaction = require("./transaction");
const app = express();

app.use(express.json());





   transaction.getContract().then(
       (contract) => {
             app.listen(3000, () => console.log(' listening on port 3000.'));


app.post('/invoke', (req, res) => {

    const key = req.body.args[0]
    const value = req.body.args[1]

    transaction.set(contract, key,value).then((result) => {
        res.send("tt");
    }).catch(
        (error => {
             res.status(400).send({
               message: "error"
            });
        })
    )


  });


       })


