const Web3 = require('web3');
const utils = require('./utils')
const networkUrl = "http://18.117.143.145:8545"
const transaction = require("./transaction");
const web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
let latestKnownBlockNumber = -1;
let blockTime = 2000;
let latencyTx = []
let receivedTx = []

checkCurrentBlock()

function calculateLatencyToTable(){
    const pending = utils.readFromFile("results/pending.txt")
    const received = utils.readFromFile("results/received.txt")
    for (const tx of received){
          let obj = pending.find(o => o.TXID === tx.TXID);
          if (obj) {
             const latency = utils.timeStringToSeconds(tx.addedTime) - utils.timeStringToSeconds(obj.time)
            latencyTx.push({"latency": latency, "time": obj.time})
          }
   }

}

function calculateLatency(){
    console.log("time,count,latency")
    const pending = utils.readFromFile("results/pending.txt")
    const received = utils.readFromFile("results/received.txt")
    let oldTime = received[0].addedTime;
     let countTx = 0
    let latency = 0
    for (const tx of received){
          if (tx.addedTime === oldTime){
             let obj = pending.find(o => o.TXID === tx.TXID);
          if (obj) {
              latency += utils.timeStringToSeconds(tx.addedTime) - utils.timeStringToSeconds(obj.time)
               countTx ++
          }

         }else {
               console.log(oldTime+ ","+ countTx+","+ latency)
               oldTime = tx.addedTime
                countTx = 0
                  latency = 0
          }


   }

}

async function pollBlockInRange(start, end) {


    for (let i = start; i < end; i++) {
         let res = await pollTxsBlocks(i);
        Array.prototype.push.apply(receivedTx,res);

    }
    const currentTx = utils.readFromFile("results/pending.txt")

    calculateLatency(currentTx, receivedTx)


}


async function checkCurrentBlock() {
    const currentBlockNumber = await web3.eth.getBlockNumber()
    console.log("Current blockchain top: " + currentBlockNumber, " | Script is at: " + latestKnownBlockNumber)
    while (latestKnownBlockNumber === -1 || currentBlockNumber > latestKnownBlockNumber) {
        await processBlock(latestKnownBlockNumber === -1 ? currentBlockNumber : latestKnownBlockNumber + 1);
    }
    setTimeout(checkCurrentBlock, blockTime);
}

async function processBlock(blockNumber) {
    console.log("We process block: " + blockNumber)
    pollTxsBlocks(blockNumber).then((res) => {
        for (const element of res) {
            console.log("TXID: ", element.TXID , " time: " , element.addedTime)
        }
        // const currentTx = transaction.getPendingQueue()
        // calculateLatency(currentTx,res)
         Array.prototype.push.apply(receivedTx,res);

    })

    latestKnownBlockNumber = blockNumber;
}



function writeReceviedQueueToFile() {
    console.log(receivedTx.length)
	utils.writeToFile("results/received.txt", receivedTx)
}


function getlatencyTX() {
	return latencyTx
}

async function pollTxsBlocks(number) {
    const event = new Date();
    //const received = utils.getTimeWithMilliseconds(event)
    const received = event.toLocaleTimeString('en-IT', { hour12: false });
    let result = []

    // process transaction in block
    let block =  await web3.eth.getBlock(number);
    //let received = utils.timestampToTime(block.timestamp);
    let txs = block.transactions;
    txs = utils.addSendElmtToArray(txs,received)

     // process transaction in uncle
    let unclesTx = []
    const uncles = block.uncles;

    for (const element of uncles) {
       block = await web3.eth.getBlock(element);
       // received = utils.timestampToTime(block.timestamp);
       if (block.transactions){
            for (const tx of block.transactions) {
       unclesTx.push(tx)
                //result.push({"TXID": tx, "addedTime": time})
    }
       }
    }
    unclesTx = utils.addSendElmtToArray(unclesTx,received)
    Array.prototype.push.apply(txs,unclesTx);
    return txs
}




module.exports = {getlatencyTX, pollBlockInRange,writeReceviedQueueToFile,calculateLatency, checkCurrentBlock};