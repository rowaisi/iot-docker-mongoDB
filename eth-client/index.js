var ethers = require('ethers');
var url = 'http://3.138.182.146:8545';


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


var provider = new ethers.providers.JsonRpcProvider(url);
// provider.getBlockNumber().then((result) => {
//     console.log("Current block number: " + result);
// });
//
// provider.listAccounts().then(result => console.log(result))
var signer = provider.getSigner(0);


const pk="91fa188e5e01a3ba4df713c97e1b712a878451db3952fc104f7eb90e9f860e0c"

const privateKey1Buffer = Buffer.from(pk, 'hex')

let wallet = new ethers.Wallet(privateKey1Buffer, provider);

const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

function set(key, value){



contract.set(key, value).then(
	(res) => {
		console.log(res.hash)
	}
).catch((err) => {
	console.log(err)
})

// let tx = await contract.set(key, value);
// console.log(tx.hash);

}

module.exports = { set };