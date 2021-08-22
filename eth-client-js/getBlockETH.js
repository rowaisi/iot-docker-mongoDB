var Web3 = require('web3');
const utils = require('./utils')
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const start = 1;
const end = 200;
web3.eth.getBlockNumber().then(block => {
    console.log(block)
    getBlocks(start,block)
});

/*
number: The block number
difficulty: Integer of the difficulty for this block
totalDifficulty: Integer of the total difficulty of the chain until this block.
size: Integer the size of this block in bytes.
gasLimit: The maximum gas allowed in this block.
gasUsed: The total used gas by all transactions in this block.
timestamp: The unix timestamp for when the block was collated.
transactions: Array of transaction objects, or 32 Bytes transaction hashes
uncles: Array of uncle hashes.
 */
async function getBlocks(start, end) {

    console.log("timestamp,number,txtCount,size,difficulty,gasLimit,gasUsed")
    for (let i = start; i <= end; i++) {
        let block = await web3.eth.getBlock(i);
        let received = utils.timestampToTime(block.timestamp);
         let txs = block.transactions;
         const uncles = block.uncles;
        for (const element of uncles) {
               block = await web3.eth.getBlock(element);
               if (block.transactions){
                    for (const tx of block.transactions) {
               txs.push(tx)

                    }
                }
        }

      console.log(received + "," +block.number + "," + txs.length + ","+ block.size+  "," + block.difficulty+ "," + block.gasLimit +  "," + block.gasUsed)
    }
 }

