const data = [
      {"url": "http://localhost:8545", "account": "0xa7efd857de41dc223cfc8cf6fe052348492864c4"},
    {"url": "http://localhost:8546", "account": "0x116C95B6f0599b80EdaEF96dB4A0a03890bAf812"},
{"url": "http://localhost:8547", "account": "0xe062C6acEF6e44a009dfF67bCBdDf2C780DdbC91"}]

 const urlRad = data[Math.floor(Math.random()*data.length)];
console.log(urlRad.account)