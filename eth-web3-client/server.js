

const express = require('express');
const transaction = require("./transaction");
const app = express();
app.use(express.json());


app.post('/invoke', (req, res) => {
    key = req.body.args[0]
    value = req.body.args[1]
     transaction.set(key,value).then((result) => {
         if (result.status ===0) {
              res.status(400).send({
               message: "error"
            });
         }
      res.send(result);
    })
  });

app.post('/gas', (req, res) => {
   transaction.getGasPrices()
     res.send("success");
  });

  app.listen(3000, () => console.log('Example app is listening on port 3000.'));
