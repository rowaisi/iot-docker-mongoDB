

const express = require('express');
const transaction = require("./transaction");
const app = express();
app.use(express.json());


app.post('/invoke', (req, res) => {
    console.log('Got body:', req.body.function);
    if (! key ||!value) {
      res.send("args must have a value")
    }
    key = req.body.args[0]
    value = req.body.args[1]
    transaction.set(key,value)
    res.send('Successful response.');
  });

  app.listen(3000, () => console.log('Example app is listening on port 3000.'));

