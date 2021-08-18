const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const changeStream = require('./services/changeStream.service')
dotenv.config();
const cors = require('cors');
// create express app
const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use(cors());

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const fs = require("fs");
const yaml = require("js-yaml");


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to our application !"});
});

app.get('/resource',  (req, res) => {
     changeStream.getResourceMetricsFromDatabase().then(resource =>{
        res.json({"data": resource});
    })

});

app.get('/performance',  (req, res) => {
     changeStream.getPerformanceMetricsFromDatabase().then(performance =>{
        res.json({"data": performance});
    })
});

app.get('/configuration',  (req, res) => {

    try {
        let configuration = {}
        let fileContents = fs.readFileSync('../configuration/blockchain.yaml', 'utf8');
        let data = yaml.load(fileContents);
        const blockchain = data["blockchain"]["type"]


        if (blockchain === "ethereum-clique"){
            let result =  data["ethereum"]["receivers"].map(a => a.name);
            configuration = {
                blockchain: "Ethereum",
                consensus: "Clique | Proof of Authority",
                receivers: result,
                nodes: data["nodeNumber"],
                size: data["dataSize"]
            }
        }

        if (blockchain === "ethereum-pow"){
            let result =  data["ethereum"]["receivers"].map(a => a.name);
            configuration = {
                blockchain: "Ethereum",
                consensus: "Proof of Work",
                receivers: result,
                nodes: data["nodeNumber"],
                size: data["dataSize"]
            }
        }

        if (blockchain === "sawtooth-pbft"){
            let result =  data["sawtooth"]["receivers"]
            configuration = {
                blockchain: "Sawtooth",
                consensus: "Practical Byzantine Fault Tolerance (PBFT)",
                receivers: result,
                nodes: data["nodeNumber"],
                size: data["dataSize"]
            }
        }

        if (blockchain === "sawtooth-poet"){
            let result =  data["sawtooth"]["receivers"]
            configuration = {
                blockchain: "Sawtooth",
                consensus: "Proof of Elapsed Time (PoET)",
                receivers: result,
                nodes: data["nodeNumber"],
                size: data["dataSize"]
            }
        }

        if (blockchain === "sawtooth-raft"){
            let result =  data["sawtooth"]["receivers"]
            configuration = {
                blockchain: "Sawtooth",
                consensus: "Raft",
                receivers: result,
                nodes: data["nodeNumber"],
                size: data["dataSize"]
            }
        }

        if (blockchain === "fabric"){
            let result =  ["peer 1 organization 1"]
            configuration = {
                blockchain: "Hyperledger Fabric",
                consensus: "Raft",
                receivers: result,
                nodes: data["nodeNumber"],
                size: data["dataSize"]
            }
        }


        res.json({"data": configuration});


    } catch (e) {
        console.log(e);
    }

});

//Middleware
app.use(express.json());
// require an http server which is essential for our socket-io
const http = require('http').createServer(app);
const io = require('socket.io')(http);



io.on("connection", socket => {
    console.log('[i] a user connected')

    changeStream.initChangeStream(socket)
    changeStream.initChangeStreamPerformance(socket)

    // socket.on('initialData', () => {
    //     console.log('[i] request resource initial data');
    //     changeStream.emitResourceMetrics(socket)
    // });
    //
    // socket.on('initialPerformance', () => {
    //     console.log('[i] request initial performance data');
    //     changeStream.emitPerformanceMetrics(socket)
    // });
    // handle disconnect event..
    socket.on('disconnect', () => {
        console.log('[i] User closed connection (logout)');
    });

    // handle close event..
    socket.on('close', () => {
        socket.disconnect();
    });

});

// listen for requests
http.listen(3001, () => {
    console.log("Server is listening on port 3001");
});
