
const database = require('../helpers/swarm.db')
const {exit} = require("process");
const { Collection } = require('mongoose');
const {getPerformanceMetricsFromDatabase, getResourceMetricsFromDatabase} = require("./changeStream.service");

var resourceCollection = null;
var performanceCollection = null;

exports.initChangeStream = async(socket) => {
    const pipeline = [
        {
            $project: { documentKey: false }
        }
    ];

    database.dbConnect().then(
        (client) => {
            console.log(" [x] Mongodb connection is open");
            const db = client.db("benchmarker");
            resourceCollection = db.collection("resource")
            const changeStream = resourceCollection.watch(pipeline);
            // start listen resource to changes
            changeStream.on("change", function(change) {
                // send data using socket.io to the client app
                socket.emit('resource', change.fullDocument);
                console.log(' [x] Sent resource emit() ..');

            })
        }).catch(err => {
        console.error(err);
        exit(0);
    });
}
exports.initChangeStreamPerformance = async(socket) => {
    const pipeline = [
        {
            $project: { documentKey: false }
        }
    ];

    database.dbConnect().then(
        (client) => {
            console.log(" [x] Mongodb connection is open");
            const db = client.db("benchmarker");
            performanceCollection = db.collection("performance")
            const changeStreamPerformance = performanceCollection.watch(pipeline);
            // start listen performance to changes
            changeStreamPerformance.on("change", function(change) {
                // send data using socket.io to the client app
                socket.emit('performance', change.fullDocument);
                console.log(' [x] Sent performance emit() ..');
            })
        }).catch(err => {
        console.error(err);
        exit(0);
    });
}

exports.getResourceMetricsFromDatabase = async()=> {

    if (!resourceCollection) {
        console.log("1")
        const client =await database.dbConnect()
        console.log(" [x] Mongodb connection is open");
        const db = client.db("benchmarker");
        resourceCollection = db.collection("resource")
    }

    return resourceCollection.find({}).toArray()
}

exports.getPerformanceMetricsFromDatabase = async()=> {

    if (!performanceCollection) {
        console.log("1")
        const client =await database.dbConnect()
        console.log(" [x] Mongodb connection is open");
        const db = client.db("benchmarker");
        performanceCollection = db.collection("performance")
    }

    return performanceCollection.find({}).toArray()
}

exports.emitResourceMetrics = async (socket) => {

    try {
       const data = await getResourceMetricsFromDatabase();
        socket.emit('initial_data', data);
        console.log(' [x] Sent an emit() ..');
    }catch (e ) {
        console.log(e)
    }

}

exports.emitPerformanceMetrics = async (socket) => {

    try {
       const data = await getPerformanceMetricsFromDatabase();
        socket.emit('initial_performance', data);
        console.log(' [x] Sent an emit() ..');
    }catch (e ) {
        console.log(e)
    }

}
