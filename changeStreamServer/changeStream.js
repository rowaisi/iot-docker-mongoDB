const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const database = require('./helpers/swarm.db')
const {dbConnect} = require("./helpers/swarm.db");

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

      })
                })
//
// MongoClient.connect("mongodb://192.168.137.129:27011,192.168.137.129:27012,192.168.137.129:27013/?replicaSet=rs0",
//     {
//                 useUnifiedTopology: true,
//                 useNewUrlParser: true
//             })
//   .then(client => {
//       console.log("Connected correctly to server");
//       //
//       //   const db = client.db("benchmarker");
//       //   const collection = db.collection("benchmarker");
//       //
//       //   const changeStream = collection.watch(pipeline);
//       //
//       //   // start listen to changes
//       // changeStream.on("change", function(change) {
//       // console.log(change);
//     // });
//
//   }).catch(
//             (err) => console.log(err)
//         )