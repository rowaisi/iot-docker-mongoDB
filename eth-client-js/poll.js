const Web3 = require('web3');
const utils = require('./utils')
const networkUrl = "http://localhost:8545"
const transaction = require("./transaction");
const web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));
let latestKnownBlockNumber = -1;
let blockTime = 2000;
let latencyTx = []

function calculateLatency(pending, received){
    for (const tx of received){
          let obj = pending.find(o => o.TXID === tx.TXID);
          if (obj) {
              console.log("####  ", obj.TXID, " #######")
              console.log(tx.addedTime , "=> ", utils.timeStringToSeconds(tx.addedTime))
              console.log(obj.time , "=> ", utils.timeStringToSeconds(obj.time))
             const latency = utils.timeStringToSeconds(tx.addedTime) - utils.timeStringToSeconds(obj.time)
            latencyTx.push({"latency": latency, "time": obj.time})
          }



    }
}

async function processBlock(blockNumber) {
    console.log("We process block: " + blockNumber)
    pollTxsBlocks(blockNumber).then((res) => {
        const currentTx = transaction.getPendingQueue()

        calculateLatency(currentTx,res)
    })

    latestKnownBlockNumber = blockNumber;
}

async function checkCurrentBlock() {
    const currentBlockNumber = await web3.eth.getBlockNumber()
    console.log("Current blockchain top: " + currentBlockNumber, " | Script is at: " + latestKnownBlockNumber)
    while (latestKnownBlockNumber === -1 || currentBlockNumber > latestKnownBlockNumber) {
        await processBlock(latestKnownBlockNumber === -1 ? currentBlockNumber : latestKnownBlockNumber + 1);
    }
    setTimeout(checkCurrentBlock, blockTime);
}

async function pollBlockInRange(start, end) {
    let allTx = []

    for (let i = start; i < end; i++) {
         let res = await pollTxsBlocks(i);
        Array.prototype.push.apply(allTx,res);

    }
    const currentTx = utils.readFromFile("results/pending.txt")

    calculateLatency(currentTx, allTx)


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




module.exports = {getlatencyTX, pollBlockInRange};