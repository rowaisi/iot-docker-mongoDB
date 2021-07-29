// const PerformanceDAO = require('../dao/performance.dao')
//
// exports.savePerformance =  (performance) => {
//
//     return new Promise((resolve, reject) => {
//
//         const performance = {"cpu": 5}
//
//           PerformanceDAO.save(performance).then((res) => {
//                         resolve(res);
//
//                     });
//
//
//     });
//
// }


const database = require("../dao/performance.dao")




// inset the event in the database
module.exports = (event) => {
    database.create(event).then(
        (newEvent) => {
            console.log(" [x] inserted to database");
        }
    )
}

