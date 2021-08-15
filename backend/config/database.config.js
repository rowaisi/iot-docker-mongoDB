// require('dotenv').config()
// var ip = require("ip");
// var LOCAL_IP = ip.address();
const yaml = require('js-yaml');
const fs = require("fs");
const path = require("path");
var connectionString = ""
try {
    let fileContents = fs.readFileSync('/configuration/blockchain.yaml', 'utf8');
    let data = yaml.load(fileContents);
    if (data.replicaSet ){
          connectionString =data.replicaSet.join(',')
    }else {
        new Error('connection string for replicaset is not defined in the configuration file')
    }

} catch (e) {
    console.log(e);
}
module.exports = {

   //url: `mongodb://${LOCAL_IP}:27011,${LOCAL_IP}:27012,${LOCAL_IP}:27013?replicaSet=rs0`
    url: "mongodb://"+connectionString+"?replicaSet=rs0"
}
