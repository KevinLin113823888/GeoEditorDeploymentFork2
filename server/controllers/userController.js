const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");
const userInfoSchema = require("../models/userInfoModel");

class userController {
    static async register(req, res) {
        var { name, username, email, password } = req.body;
        var user = await userInfoSchema.findOne({email});
        if (user){
            return res.status(200).json({ error: true, message: 'user exist' });
        }
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

    static async login(req, res) {
        var { email, password } = req.body;
        var user = await userInfoSchema.findOne({email : email});
        if (!user) {
          return res.status(200).json({ error: true, message: 'invalid email' });
        }
        var isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return res.status(200).json({ error: true, message: 'wrong password' });
        }
        return res.status(200).cookie("values", {randomid: makeKey(), id: user._id, name: user.name}).json({status: 'OK', name: user.name});
    }

    static async logoutUser(req, res, next) {
        console.log("LOGGING OUT");
        res.status(200).clearCookie("values").json({status: 'OK'});
    }

    static async verifyUser(req, res, next) {
        var { email, key} = req.query;
        var emailUser = await userInfoSchema.findOne({email});
        var keyUser = await userInfoSchema.findOne({key});
        if(emailUser === null){
            return res.status(200).json({ error: true, message: 'email is null' });
        }
        if(keyUser === null){
            return res.status(200).json({ error: true, message: 'key is null' });
        }
        if (emailUser._id.toString() != keyUser._id.toString()) {
            await userModel.deleteOne({email});
            return res.status(200).json({ error: true, message: 'user is not the same' });
        }
        var curr_date = new Date();
        let result = {
            status: 'OK',
            email: email,
            date: curr_date, 
        };
        return res.status(200).json({status: 'OK', name: emailUser.name});
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