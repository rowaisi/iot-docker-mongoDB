const Web3 = require('web3');
const request = require('request');

class EthereumNetwork {
  constructor(networkUrl, account,contractAddress,contractAbi) {
    this.networkUrl = networkUrl;
    this.account = account;
    this.contractAddress = contractAddress;
    this.web3 = new Web3(new Web3.providers.HttpProvider(networkUrl))
    this.storeContract = new this.web3.eth.Contract(contractAbi, contractAddress);
  }
  encodeABI(key,value){
	return this.storeContract.methods.set(key, value).encodeABI()
  }
    set(key, value){
      const method = 'eth_sendTransaction';
        let data = this.encodeABI(key,value);

       const params = [{"gas": "0x100000",
                       "gasPrice": "0x0",
                       "from": this.account,
                       "to": this.contractAddress,
                       "data": data
                       }];

       const payload = {"jsonrpc": "2.0",
                       "method": method,
                       "params": params,
                       "id": 1};

       const headers = {'Content-type': 'application/json'};
       const d = new Date();
	   const send = d.toLocaleTimeString();
	   request.post({
          headers: headers,
          url:     this.networkUrl,
          body:    JSON.stringify(payload)
        }, function(error, response, body){
            if (error){
                    console.log(error);

            }
            if(body){

                const data = JSON.parse(body)

                console.log("TXID: ", data.result, "send ", send)
                //pendingQueue.push({"TXID": data.result, "time": send})
                //console.log(pendingQueue.length)
            }


        });



    }
}

module.exports(EthereumNetwork)