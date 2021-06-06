const fs = require('fs');

function timeStringToSeconds(tine){
    const a = tine.split(':');


    const seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    return seconds
}

function timeStringToMilliSeconds(tine){
    const a = tine.split(':');
    const sec = a[2].split('.');


    const seconds = (+a[0]) * 60 * 60  * 1000 + (+a[1]) * 60 * 1000 + (+sec[0]) * 1000 + (+sec[1]);

    return seconds
}

const getTimeWithMilliseconds = date => {
  return `${date.toLocaleTimeString('en-IT', { hour12: false })}.${date.getMilliseconds()}`;
}

function timestampToTime(timestamp){
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
}

function addSendElmtToArray(array, time  ){
    let newArray = []
     for (const element of array) {
         const newElmt = {"TXID": element, "addedTime": time};
         newArray.push(newElmt)
     }
     return newArray
}

function writeToFile(file,data){
fs.writeFile(file, JSON.stringify(data), function (err) {
  if (err) return console.log(err);
  console.log("done.");
});
}

function readFromFile(file){
    try {
  const data = fs.readFileSync(file, 'utf8')
        return JSON.parse(data)
} catch (err) {
  console.error(err)
}

}


module.exports = {timeStringToSeconds, getTimeWithMilliseconds, timestampToTime, addSendElmtToArray, timeStringToMilliSeconds,writeToFile, readFromFile}