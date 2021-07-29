require('dotenv').config()
var ip = require("ip");
var LOCAL_IP = ip.address();

module.exports = {
    //mongo mongodb://192.168.137.129:27011,192.168.137.129:27012,192.168.137.129:27013/?replicaSet=rs0
    url: `mongodb://${LOCAL_IP}:27011,${LOCAL_IP}:27012,${LOCAL_IP}:27013?replicaSet=rs0`
}
