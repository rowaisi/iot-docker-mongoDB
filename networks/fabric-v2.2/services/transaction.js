


async function set(name,value,contract,funcName){
      new Promise((resolve, reject)=>{
            txn = contract.createTransaction(funcName);
            start = new Date();
            resolve("test")
            txn.submit(name,value);
        }).then(()=>{
            var end = new Date() - start
            const txnID = txn.getTransactionId();
            console.log("txnID: ",txnID, " latency_ms: ", end)
        }).catch((error)=>{
            console.error(`Failed to invoke with error: ${error}`);
        });
}

module.exports = {set}