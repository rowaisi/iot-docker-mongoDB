const Web3 = require('web3');
const request = require('request');
const networkUrl = "http://3.138.182.146:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
const axios = require('axios')
const account = "0xa7efd857de41dc223cfc8cf6fe052348492864c4"
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

//
// async function set(key, value) {
// 	const method = 'eth_sendTransaction';
// 	let data = encodeABI(key, value);
//
// 	const params = [{
// 		"gas": "0x100000",
// 		"gasPrice": "0x0",
// 		"from": account,
// 		"to": contractAddress,
// 		"data": data
// 	}];
//
// 	const payload = {
// 		"jsonrpc": "2.0",
// 		"method": method,
// 		"params": params,
// 		"id": 1
// 	};
//
// 	// sending transaction
// 	const start = new Date()
// 	const res = await axios.post(networkUrl, payload)
// 	const end = new Date() - start
//
// 	return {"TXID": res.data.result, "latency_ms": end}
//
//
// }


function set(key, value){
   const method = 'eth_sendTransaction';
   data = encodeABI(key,value);

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

   const start = new Date()
   request.post({
  headers: {'Content-type': 'application/json'},
  url:     networkUrl,
  body:    JSON.stringify(payload)
}, function(error, response, body){
   	if (error){
   			console.log(error);

	}
   	if(body){
   		const end = new Date() - start
   		const data = JSON.parse(body)
		console.log("TXID: ", data.result, " latency_ms: ", end)

	}


});


}

module.exports = { set };
