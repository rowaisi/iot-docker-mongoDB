const Web3 = require('web3');
const utils = require('./utils')
const request = require('request');
var config = require('./config');

var fs = require('fs');

var contractAbi = JSON.parse(fs.readFileSync(config.contractABI, 'utf8'));


const web3 = new Web3(new Web3.providers.HttpProvider(config.receiver[0].url));
let queue = []


const storeContract = new web3.eth.Contract(contractAbi, config.contractAddress);

function encodeABI(key,value){
	return storeContract.methods.set(key, value).encodeABI()
}

function setWithoutWait(key, value){


   const method = 'eth_sendTransaction';
   let data = encodeABI(key,value);

   const params = [{"gas": config.gas,
                   "gasPrice": config.gasPrice,
                   "from": config.receiver[0].account,
                   "to": config.contractAddress,
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
  url:     config.receiver[0].url,
  body:    JSON.stringify(payload)
}, function(error, response, body){
   	if (error){
   			console.log(error);

	}
   	if(body){

   		const data = JSON.parse(body)

		console.log("TXID: ", data.result, "send ", send)
		queue.push({"TXID": data.result, "time": send})
	}


});

}

async function set(key, value,start){


   const method = 'eth_sendTransaction';
   let data = encodeABI(key,value);


   const urlRad = config.receiver[Math.floor(Math.random()*config.receiver.length)];
   const params = [{"gas": "0x100000",
                   "gasPrice": "0x0",
                   "from": urlRad.account,
                   "to": config.contractAddress,
                   "data": data
                   }];

   const payload = {"jsonrpc": "2.0",
                   "method": method,
                   "params": params,
                   "id": 1};

   const headers = {'Content-type': 'application/json'};

   // const event = new Date();
   // const send =event.toLocaleTimeString('en-IT', { hour12: false });
   const hash = await new Promise(async (resolve, reject) => {

		 request.post({
	  headers: headers,
	  url:     urlRad.url,
	  body:    JSON.stringify(payload)
	}, function(error, response, body){
		if (error){
			console.log("====error====")
				console.log(error);
				reject(new Error(error.errno));

		}
		if(body){

			const data = JSON.parse(body)
			if (data.error){
				console.log(data.error.message)
				reject(new Error(data.error));
			}else {
				const end = new Date() - start;
				console.log("TXID: ", data.result," send:", start, " latency_ms", end)
				//queue.push({"TXID": data.result, "send": start, "latency_ms": end})
				resolve(data.result)
			}

		}


})


   })
     return {"TXID": hash, "send": start}


}

function calculateLatencyAVG(){

	const pending = utils.readFromFile("results/pending.txt")
	console.log(pending.length)
	console.log("time count latency")
	let oldTime = pending[0].send
	let count = 0
	let sumLatency = 0
	let avgLatency =0
	let i = 0
	while (i < pending.length){
		while (i < pending.length && ((new Date(pending[i].send) - new Date(oldTime))<= 10000) && i <= pending.length){
			sumLatency += pending[i].latency_ms
			count ++;
			i ++
		}
		let localtime = new Date(oldTime).toLocaleTimeString('en-IT', { hour12: false });
			avgLatency = sumLatency / count
			console.log(localtime,count,avgLatency)
		if (i < pending.length ){
			oldTime = pending[i].send
			count = 0
			sumLatency = 0
			avgLatency =0
		}


	}


	//
	// for (const tx of pending){
	//
	// 	if ((new Date(tx.send) - new Date(oldTime)) <= 10000) {
	// 			sumLatency += tx.latency_ms
	// 			count ++;
	// 	}else {
	// 		avgLatency = sumLatency / count
	// 		console.log(time,count,avgLatency)
	// 		oldTime = tx.send
	// 		count = 1
	// 		sumLatency =tx.latency_ms
	// 		avgLatency =0
	// 		time += 10
	// 	}
	//
	//
	// }
	// console.log(total)

}

function getQueue() {
	return queue
}

function writeQueueToFile() {
	utils.writeToFile("results/pending.txt", queue)
}

module.exports = { set, getQueue, calculateLatencyAVG, writeQueueToFile };
