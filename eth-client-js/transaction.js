const Web3 = require('web3');
const utils = require('./utils')
const request = require('request');
const networkUrl = "http://localhost:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
const account = "0xa7efd857de41dc223cfc8cf6fe052348492864c4"
let pendingQueue = []
contractAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "key",
				"type": "string"
			},
			{
				"name": "value",
				"type": "string"
			}
		],
		"name": "set",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "key",
				"type": "string"
			}
		],
		"name": "get",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

const contractAddress = "0x34afe602f642aedd6322bbd68a9300845b31c27b"
const storeContract = new web3.eth.Contract(contractAbi, contractAddress);

function encodeABI(key,value){
	return storeContract.methods.set(key, value).encodeABI()
}

function setWithoutWait(key, value){


   const method = 'eth_sendTransaction';
   let data = encodeABI(key,value);

   const params = [{"gas": "0x100000",
                   "gasPrice": "0x0",
                   "from": account,
                   "to": contractAddress,
                   "data": data
                   }];

   const payload = {"jsonrpc": "2.0",
                   "method": method,
                   "params": params,
                   "id": 1};

   const headers = {'Content-type': 'application/json'};
   const event = new Date();
   //const send = utils.getTimeWithMilliseconds(event)
   const send =event.toLocaleTimeString('en-IT', { hour12: false });
   request.post({
  headers: headers,
  url:     networkUrl,
  body:    JSON.stringify(payload)
}, function(error, response, body){
   	if (error){
   			console.log(error);

	}
   	if(body){

   		const data = JSON.parse(body)

		console.log("TXID: ", data.result, "send ", send)
		pendingQueue.push({"TXID": data.result, "time": send})
	}


});


}

async function set(key, value){


   const method = 'eth_sendTransaction';
   let data = encodeABI(key,value);

   const params = [{"gas": "0x100000",
                   "gasPrice": "0x0",
                   "from": account,
                   "to": contractAddress,
                   "data": data
                   }];

   const payload = {"jsonrpc": "2.0",
                   "method": method,
                   "params": params,
                   "id": 1};

   const headers = {'Content-type': 'application/json'};
   const event = new Date();
   //const send = utils.getTimeWithMilliseconds(event)
   const send =event.toLocaleTimeString('en-IT', { hour12: false });

   const hash = await new Promise(async (resolve) => {

		 request.post({
	  headers: headers,
	  url:     networkUrl,
	  body:    JSON.stringify(payload)
	}, function(error, response, body){
		if (error){
				console.log(error);

		}
		if(body){

			const data = JSON.parse(body)

			console.log("TXID: ", data.result, "send ", send)
				resolve(data.result)
		}


});


   })
     return {"TXID": hash, "send": send}


}


function getPendingQueue() {
	return pendingQueue
}

function writePendingQueueToFile() {
	utils.writeToFile("results/pending.txt", pendingQueue)
}

module.exports = { set, getPendingQueue, writePendingQueueToFile };
