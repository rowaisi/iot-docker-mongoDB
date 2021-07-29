
const database = require('../helpers/swarm.db')
const {exit} = require("process");
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
            const collection = db.collection("benchmarker")
            const changeStream = collection.watch(pipeline);
            // start listen to changes
            changeStream.on("change", function(change) {
                console.log(change.fullDocument);
                // send data using socket.io to the client app
                socket.emit('resource', change.fullDocument);
                console.log(' [x] Sent an emit() ..');

            })
        }).catch(err => {
        console.error(err);
        exit(0);
    });
}