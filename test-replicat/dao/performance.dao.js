
const database = require('../helpers/swarm.db')
const {dbConnect} = require("../helpers/swarm.db");

var mongodbClient;
var db;

// Get a DB connection when this module is loaded
(function dbConnect()  {

    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
        } else {
            database.dbConnect().then(
                (client) => {
                    console.log(" [x] Mongodb connection is open");
                    mongodbClient = client;
                    db = client.db("Benchmarker");
                    resolve(db)
                }
            ).catch(
                (err) => reject(err)
            )


        }
    });
})();

exports.create =(performance) => {
         return new Promise((resolve, reject) => {
             if (!db) {
                 console.log("not dn")
                 dbConnect().then(r => {

                      let Performances = db.collection('Performances');

             Performances.insertOne(performance, (err, result) => {
                         if (err) {
                                 console.log('Error occurred: ' + err.message);
                                 reject(err);
                             } else {
                                 resolve(result);
                             }
                     });



                 })


             }else {
                 let Performances = db.collection('Performances');

             Performances.insertOne(performance, (err, result) => {
                         if (err) {
                                 console.log('Error occurred: ' + err.message);
                                 reject(err);
                             } else {
                                 resolve(result);
                             }
                     });

             }

             });
     }

// This will handle kill commands, such as CTRL+C:
// process.on('SIGINT',  function () {
//     console.log('Bye');
//     if (mongodbClient && mongodbClient.isConnected()) {
//         mongodbClient.close();
//     }
// });

function dbClose() {
    if (mongodbClient && mongodbClient.isConnected()) {
        mongodbClient.close();
    }
    console.log(" [x] Mongodb connection is closed");
}
