const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
var config = {};



try {
    let fileContents = fs.readFileSync('../configuration/blockchain.yaml', 'utf8');
    let data = yaml.load(fileContents);
    if (data.ethereum ){
          config.receiver = data.ethereum.receivers;
          config.contractAddress = data.ethereum.contract.address;
          config.gas = data.ethereum.contract.gas;
          config.gasPrice = data.ethereum.contract.gasPrice;
          config.contractABI = path.resolve(data.ethereum.contract.contractABI);
    }

} catch (e) {
    console.log(e);
}

module.exports = config