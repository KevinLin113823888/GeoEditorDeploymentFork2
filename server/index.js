const express = require("express");
const cookieParser = require('cookie-parser');
cors = require("cors");

const connectDB = require("./mongo");
var userRouter = require('./routes/userRoute');
// var mapRouter = require('./routes/mapRoute');

const app = express();
port = process.env.PORT || 9000;

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
connectDB();

app.use('/user', userRouter);
// app.use('/map', mapRouter);

app.listen(port, () => console.log("Backend server live on " + port));

module.exports = app;