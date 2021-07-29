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

// Connecting to the users database
mongoose.connect(dbConfig.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then((client) => {
    console.log("Connected successfully to the  database");

}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to our application !"});
});
//Middleware
app.use(express.json());
// require an http server which is essential for our socket-io
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on("connection", socket => {
    console.log('a user connected');
    changeStream.initChangeStream(socket)

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
http.listen(3000, () => {
    console.log("Server is listening on port 3000");
});