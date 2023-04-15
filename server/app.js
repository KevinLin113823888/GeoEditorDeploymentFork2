const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();

app.use(cors({
    origin: ['http://localhost:3000','https://bejewelled-rugelach-940512.netlify.app'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));

app.use(cookieParser());

const connectDB = require("./mongo");
var userRouter = require('./routes/userRoute');
var mapRouter = require('./routes/mapRoute');
var communityRouter = require('./routes/communityRoute');
connectDB();
app.use('/user', userRouter);
app.use('/map', mapRouter);
app.use('/community', communityRouter);

module.exports = app;