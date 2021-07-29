const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const load = require("./services/load")

 require("./dao/performance.dao")

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.listen(3000, () => {


    console.log("Server is listening on port 3000");
    load({"test": "test"})



});
function sayHi(ee) {
  console.log(ee)
}
