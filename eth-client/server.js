

const { response } = require('express');
const express = require('express');
const transaction = require("./index");
const app = express();
app.use(express.json());


app.post('/invoke', (req, res) => {
    
    key = req.body.args[0]
    value = req.body.args[1]
    // transaction.set(key,value)
    //     .then((result) => {
    //   //console.log(result)
    //   res.send(result);
    // })
    //     .catch(err => console.log(err))

    transaction.set(key,value)
    res.send("successful");

  });

  app.listen(3000, () => console.log(' listening on port 3000.'));

