/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets, DefaultEventHandlerStrategies  } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');





const channelName = "mychannel";
const contractName = "kvstore";


const isOpenLoopMode = true;

const port = 3000;

async function getChannel(channelName, contractName) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            process.exit(1);
        }

        // Create a new gateway for connecting to our peer node.
        var mode;
        if (isOpenLoopMode) {
            mode = DefaultEventHandlerStrategies.NONE;
        } else {
            mode = DefaultEventHandlerStrategies.MSPID_SCOPE_ALLFORTX
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, 
            { 
            wallet, identity: 'appUser', 
            discovery: { enabled: true, asLocalhost: true}, 
            eventHandlerOptions: {
                strategy: mode
            }  
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(contractName);
        console.log(`Contract ${contractName} on Channel ${channelName} has been setup... }`);
        return contract;

    } catch (error) {
        console.error(`Failed to set up the contract and channel: ${error}`);
        process.exit(1);
    }
}

getChannel(channelName, contractName).then((contract)=>{
    const app = express();

    app.listen(port, () => {
        console.log(`Server running on port ${port}. Is the open-loop mode? ${isOpenLoopMode}`);
    })

    app.use(bodyParser.json());

    app.post("/invoke", (req, res) => { 
        var txn;
        const funcName = req.body["function"];
        const args = req.body["args"];
        var start; 
        new Promise((resolve, reject)=>{
            txn = contract.createTransaction(funcName);
            start = new Date();
            resolve(txn.submit(...args));
        }).then(()=>{
            var end = new Date() - start
            const txnID = txn.getTransactionId();
            console.log("txnID: ",txnID, " latency_ms: ", end)
            res.json({"status": "0", "txnID": txnID, "latency_ms": end});
        }).catch((error)=>{
            console.error(`Failed to invoke with error: ${error}`);
            res.status(400).send({"status": "1", "message": error.message});
        });
    });

    app.get("/query", (req, res) => {
        const funcName = req.query.function;
        const args = req.query.args.split(',');
        console.log(`Receive funcName: ${funcName}, args: ${args}`);
        var start;
        new Promise((resolve, reject)=>{
            start = new Date();
            resolve(contract.evaluateTransaction(funcName, ...args));
        }).then((result)=>{
            var end = new Date() - start
            res.json({"status": "0", "result": result.toString(), "latency_ms": end});
        }).catch((error)=>{
            console.error(`Failed to query with error: ${error}`);
            res.json({"status": "1", "message": error.message});
        });
    });
})