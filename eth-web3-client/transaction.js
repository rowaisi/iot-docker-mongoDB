const Web3 = require('web3');
const Tx = require('ethereumjs-tx')
var request = require('request-promise');
var networkUrl = "https://ropsten.infura.io/v3/88ed3442ced64c86807fcdb2a5016a48"
var web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
var lastNonce = 0
var gasPrices = []

// contractAbi = [
// 	{
// 		"constant": false,
// 		"inputs": [
// 			{
// 				"name": "key",
// 				"type": "string"
// 			},
// 			{
// 				"name": "value",
// 				"type": "string"
// 			}
// 		],
// 		"name": "set",
// 		"outputs": [],
// 		"payable": false,
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"constant": true,
// 		"inputs": [
// 			{
// 				"name": "key",
// 				"type": "string"
// 			}
// 		],
// 		"name": "get",
// 		"outputs": [
// 			{
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"payable": false,
// 		"stateMutability": "view",
// 		"type": "function"
// 	}
// ]
contractAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allFiles","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"name":"keyvalue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"userFiles","outputs":[{"internalType":"string","name":"key","type":"string"},{"internalType":"string","name":"value","type":"string"}],"stateMutability":"view","type":"function"}]
var contractAddress = "0x3f4db14c176aef4124543b14720adc4c630a25ad"
var storeContract = new web3.eth.Contract(contractAbi, contractAddress);

const account1 = "0xD1E62Da37e0A2486ded8b93737D62c619A84c759"
web3.eth.defaultAccount = account1;

const pk="0e5cba5c7291d72d069c5890a5446ac4f342f0d5988113a8fe12ade4e52f6f2b"

const privateKey1Buffer = Buffer.from(pk, 'hex')
web3.eth.getTransactionCount(account1, (err, txCount) => {
	lastNonce = txCount
});


// async function set(key, value) {
// 	var gasPrice = web3.utils.toWei('0', 'gwei');
// 	var options = {
// 		url: "https://api.etherscan.io/api?module=gastracker&action=gasoracle",
// 		method: 'GET',
// 		json: true
// 	}
// 	var res1 = await request(options);
// 	if(res1.status == "1"){
// 		gasPrice = web3.utils.toWei(res1.result.SafeGasPrice, 'gwei');
// 		console.log("gas price",gasPrice)
// 	}
// 	var gasLimit = 3000000;
//
//     var data = storeContract.methods.set(key, value).encodeABI();
//     web3.eth.getTransactionCount(account1,  async (err, txCount) => {
// 		console.log(txCount)
// 		// Build the transaction
// 		const txObject = {
// 			nonce: web3.utils.toHex(txCount),
// 			to: contractAddress,
// 			value: web3.utils.toHex(web3.utils.toWei('0', 'ether')),
// 			gasLimit: web3.utils.toHex(gasLimit),
// 			gasPrice: web3.utils.toHex(gasPrice),
// 			data: data,
// 			chainId: 3
// 		}
// 		// Sign the transaction
// 		const tx = new Tx(txObject);
// 		tx.sign(privateKey1Buffer);
//
// 		const serializedTx = tx.serialize();
// 		const raw = '0x' + serializedTx.toString('hex');
//
// 		const hash = await new Promise(async (resolve) => {
// 			await web3.eth.sendSignedTransaction(raw)
// 				.once('transactionHash', (hash) => {
// 					resolve(hash)
// 				})
//
// 		})
// 		var time = new Date().toLocaleTimeString();
// 		console.log("time = ", time, "txnID: ", hash)
// 		return {"time": time, "txnID": hash, "latency_ms": 0};
// 	})
//
// }

// async function set(key, value) {
// 	var chainId = 3
// 	var gasPrice = web3.utils.toWei('0', 'gwei');
// 	var options = {
// 		url: "https://api.etherscan.io/api?module=gastracker&action=gasoracle",
// 		method: 'GET',
// 		json: true
// 	}
// 	var res1 = await request(options);
// 	var hashRes =""
// 	if(res1.status == "1"){
// 		gasPrice = web3.utils.toWei(res1.result.SafeGasPrice, 'gwei');
// 	}
// 	var count = await web3.eth.getTransactionCount(account1);
//
// 	var data = storeContract.methods.keyvalue(key, value).encodeABI();
//
// 	console.log("last nonce:",lastNonce)
// 	var gasLimit = 3000000;
// 	//set transaction variable
// 		var rawTransaction = {
// 		"from": account1,
// 		"nonce": web3.utils.toHex(lastNonce),
// 		"gasPrice": web3.utils.toHex(gasPrice),
// 		"gasLimit": web3.utils.toHex(gasLimit),
// 		"to": contractAddress,
// 		"value": "0x",
// 		"data": data,
// 		"chainId": web3.utils.toHex(chainId)
// 		};
//
// 		//get private key
// 		var privKey = Buffer.from(pk, 'hex');
//
//
// 		var tx = new Tx(rawTransaction);
//
// 		//sign transaction
// 		tx.sign(privKey);
// 		var serializedTx = tx.serialize();
// const hash = await new Promise(async (resolve) => {
//
// 	web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async function(err, hash){
// 			if(err){
// 				console.log(err.message);
// 			} else {
// 				console.log("hash:", hash)
// 				lastNonce ++;
// 				resolve(hash)
//
// 			}
// 		})
//
// })
//
//
// }
function getGasPrices (){
	console.log(gasPrices.join(','))
}
async function set(key, value) {
	var gasPrice = web3.utils.toWei('0', 'gwei');
	var oldGasPrice = web3.utils.toWei('26', 'gwei');
	var options = {
		url: "https://api.etherscan.io/api?module=gastracker&action=gasoracle",
		method: 'GET',
		json: true,

	}
	var res1 = await request(options);

	if(res1.status === "1"){
		gasPrice = web3.utils.toWei(res1.result.SafeGasPrice, 'gwei');
	}else {
		gasPrice = oldGasPrice
	}
	gasPrices.push(gasPrice)
	var data = storeContract.methods.keyvalue(key, value).encodeABI();
	const txObject = {
		nonce: web3.utils.toHex(lastNonce),
		to: contractAddress,
		value: web3.utils.toHex(web3.utils.toWei('0', 'ether')),
		gasLimit: web3.utils.toHex(7010000),
		gasPrice: web3.utils.toHex(gasPrice),
		data: data,
		chainId: 3
	}
	lastNonce++;
	const tx = new Tx(txObject);
	tx.sign(privateKey1Buffer);

	const serializedTx = tx.serialize();
	const raw = '0x' + serializedTx.toString('hex');
	var start = new Date()
	var end;
	const hash = await new Promise(async (resolve) => {
		await web3.eth.sendSignedTransaction(raw)
			.once('transactionHash', (hash) => {
				end = new Date() - start
				resolve(hash)
			})
		.on('error', function(error){ console.log("error", error)
		return {"status":0, "error": error}})

	})
	var time = new Date().toLocaleTimeString();
	console.log("txnID = ", hash, " latency_ms = ", end)
	return {"status":1, "time": time, "txnID": hash, "latency_ms": end};


}
module.exports = { set,getGasPrices };
