const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./src/routes/userRoute');
const taskRouter = require('./src/routes/taskRoute');
const port = process.env.PORT || 3080;

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

app.listen(port, () => {
    console.log("Connected to port =", port);
})

process.on('uncaughtException', () => {
    console.log("Exception")

})