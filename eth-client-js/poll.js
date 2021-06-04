const Web3 = require('web3');
const networkUrl = "http://3.138.182.146:8545"
const web3 = new Web3(new Web3.providers.HttpProvider(networkUrl));

let latestKnownBlockNumber = -1;
let blockTime = 3000;

checkCurrentBlock()

async function processBlock(blockNumber) {
    console.log("We process block: " + blockNumber)
    pollTxsBlocks(blockNumber).then((res) => {
        for (const tx of res) {
            console.log("TXID: ", tx.TXID , " time:", tx.addedTime)
        }
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


async function pollTxsBlocks(number) {
    let result = []
    // process transaction in block
    let block =  await web3.eth.getBlock(number);
    let time = timestampToTime(block.timestamp);
    const txs = block.transactions;
    result = addSendElmtToArray(txs,time)

    // process transaction in uncle
    const uncles = block.uncles;
    for (const element of uncles) {
       block = await web3.eth.getBlock(element);
       time = timestampToTime(block.timestamp);
       if (block.transactions){
            for (const tx of block.transactions) {
       //txs.push(tx)
                result.push({"TXID": tx, "addedTime": time})
    }
       }
    }
    return result
}

function timestampToTime(timestamp){
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime
}

function addSendElmtToArray(array, time  ){
    let newArray = []
     for (const element of array) {
         const newElmt = {"TXID": element, "addedTime": time};
         newArray.push(newElmt)
     }
     return newArray
}