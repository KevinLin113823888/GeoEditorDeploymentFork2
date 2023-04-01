const express = require("express");
cors = require("cors");

const connectDB = require("./mongo");

app = express();
port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
connectDB();

app.listen(port, () => console.log("Backend server live on " + port));

const userInfoSchema = require("./models/userInfo");
app.post("/register", (req, res) => {
    var { name, username, email, password } = req.body;

    var key = makeKey();
    // var hashpswd = await bcrypt.hash(password, 9);
    var hashpswd = "sdfdsfsdf";
    var user = new userInfoSchema({
        name, 
        username,
        email,
        password: hashpswd, 
        key: key
    });
    user.save(); 
    console.log("saved to db");
    return res.status(200).json({status: 'OK'});
});

function makeKey() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
};