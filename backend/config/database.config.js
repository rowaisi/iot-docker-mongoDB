
const yaml = require('js-yaml');
const fs = require("fs");
let connectionString = ""

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

    url: "mongodb://"+connectionString+"?replicaSet=rs0"
}
