

const { response } = require('express');
const express = require('express');
const transaction = require("./transaction");
const app = express();

app.use(express.json());


app.post('/invoke', (req, res) => {

    const key = req.body.args[0]
    const value = req.body.args[1]

    transaction.set(sm, key,value).then((result) => {
        res.send("tt");
    }).catch(
        (error => {
             res.status(400).send({
               message: "error"
            });
        })
    )


  });



let sm;
   transaction.getContract().then(
       (contract) => {sm = contract}
  )
  app.listen(3000, () => console.log(' listening on port 3000.'));

