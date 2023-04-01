const express = require("express");
cors = require("cors");

const connectDB = require("./mongo");
var userRouter = require('./routes/userRoute');
var mapRouter = require('./routes/mapRoute');

app = express();
port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
connectDB();

app.use('/user', userRouter);
app.use('/map', mapRouter);

app.listen(port, () => console.log("Backend server live on " + port));