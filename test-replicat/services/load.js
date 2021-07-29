
const database = require("../dao/performance.dao")




// inset the event in the database
module.exports = (event) => {
    database.create(event).then(
        (newEvent) => {
            console.log(" [x] inserted to database");
        }
    )
}