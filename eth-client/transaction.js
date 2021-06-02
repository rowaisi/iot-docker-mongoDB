const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const { response } = require('express');

var networkUrl = "http://127.0.0.1:8545"
var web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
var lastNonce = 0


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
   
var contractAddress = "0x34afe602f642aedd6322bbd68a9300845b31c27b"
var storeContract = new web3.eth.Contract(contractAbi, contractAddress);

const account1 = "0xa7efd857de41dc223cfc8cf6fe052348492864c4"
web3.eth.defaultAccount = account1;

const pk="91fa188e5e01a3ba4df713c97e1b712a878451db3952fc104f7eb90e9f860e0c"

const privateKey1Buffer = Buffer.from(pk, 'hex')

web3.eth.getTransactionCount(account1, (err, txCount) => { 
	lastNonce = txCount
});


async function set(key, value) {
	
    var data = storeContract.methods.set(key, value).encodeABI();
        // Build the transaction
          const txObject = {
            nonce:    web3.utils.toHex(lastNonce),
            to:       contractAddress,
            value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
            gasLimit: web3.utils.toHex(2100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('0', 'gwei')),
            data: data,
            chainId: 13
          }
		  lastNonce ++;
            // Sign the transaction
            const tx = new Tx(txObject);
            tx.sign(privateKey1Buffer);
        
            const serializedTx = tx.serialize();
            const raw = '0x' + serializedTx.toString('hex');
			var start = new Date()
            // Broadcast the transaction
            var end;
			const hash = await new Promise(async (resolve) => {
				await web3.eth.sendSignedTransaction(raw)
				  .once('transactionHash', (hash) => {
					end = new Date() - start
					resolve(hash)
				  })
				
			  })
			  var time = new Date().toLocaleTimeString();
			  console.log("time = ", time, " latency_ms = ", end)
			  return {"time": time, "txnID": hash, "latency_ms": end};


       
 
}


module.exports = { set };