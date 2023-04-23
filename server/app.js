const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require("cors");
var session = require('express-session');

const app = express();

app.use(cors({
    origin: ['http://localhost:3000','https://bejewelled-rugelach-940512.netlify.app'],
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
}));
app.use(express.json({ limit: '100mb' }));
app.use(session(
    { 
        secret: "pizzaspaghetti", 
        cookie: { 
          httpOnly: true,
          secure: true,
         }, 
        resave: false,
        saveUninitialized: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(function(req, res, next) {
//     res.header('Content-Type', 'application/json;charset=UTF-8');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header(
//       'Access-Control-Allow-Headers',
//       'Origin, X-Requested-With, Content-Type, Accept'
//     );
//     next();
// })
  
const connectDB = require("./mongo");
var userRouter = require('./routes/userRoute');
var mapRouter = require('./routes/mapRoute');
var communityRouter = require('./routes/communityRoute');
connectDB();
app.use('/user', userRouter);
app.use('/map', mapRouter);
app.use('/community', communityRouter);

module.exports = app;