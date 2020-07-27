const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./src/routes/userRoute');
const taskRouter = require('./src/routes/taskRoute');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes.
app.use(userRouter);
app.use(taskRouter);


// Connection to MongoDB through Mongoose.
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

var http = require('http'); //importing http

function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: 'https://ki-reminder-api.herokuapp.com',
            port: PORT,
            path: '/'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    // optional logging... disable after it's working
                    console.log("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 10 * 60 * 1000); // load every 10 minutes
}

startKeepAlive();

app.listen(port, () => {
    console.log("Connected to port =", port);
})

process.on('uncaughtException', () => {
    console.log("Exception")

})