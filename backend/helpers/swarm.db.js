const MongoClient = require("mongodb").MongoClient;
const dbConfig = require('../config/database.config');

const connectionString = dbConfig.url;

exports.dbConnect = () =>  {

    return new Promise((resolve, reject) => {

        MongoClient.connect(
            connectionString,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }
        ).then(client => {
            resolve(client);

        }).catch(
            (err) => reject(err)
        )



    });
}
