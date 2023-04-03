const express = require("express");
const cookieParser = require('cookie-parser');
cors = require("cors");

const connectDB = require("./mongo");
var userRouter = require('./routes/userRoute');
var mapRouter = require('./routes/mapRoute');

const app = express();

app.use(cors({
    origin: ["http://199.19.72.130:3000"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
connectDB();

app.use('/user', userRouter);
app.use('/map', mapRouter);


module.exports = app;