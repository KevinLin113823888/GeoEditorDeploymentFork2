const mongoose = require("mongoose");
var bcrypt = require('bcrypt');
const userInfoSchema = require("../models/userInfo");

class userController {
    static async register(req, res) {
        var { name, username, email, password } = req.body;

        var key = makeKey();
        var hashpswd = await bcrypt.hash(password, 9);
        console.log(name, username, email, password, key);
        var user = new userInfoSchema({
            name, 
            username,
            email,
            password: hashpswd, 
            key: key
        });
        await user.save(); 
        console.log("saved to db");
        return res.status(200).json({status: 'OK'});
    }
}

function makeKey() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
};

module.exports = userController;