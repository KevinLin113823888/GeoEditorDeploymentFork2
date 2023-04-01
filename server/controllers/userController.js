const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");
const userInfoSchema = require("../models/userInfoModel");

class userController {
    static async register(req, res) {
        try{
            var { name, username, email, password } = req.body;
            var user = await userInfoSchema.findOne({email});

            var key = makeKey();
            console.log(req);
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
        catch (e){
            if (!user)
                console.log(e);
                return res.status(400).json({ error: true, message: "User is empty in the request body" });
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async login(req, res) {
        try{
            var { username, password } = req.body;
            var user = await userInfoSchema.findOne({username : username});
            if(!user)
                throw new Error ("Invalid username")

            var isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch)
                throw new Error("Invalid password")

            return res.status(200).cookie("values", {randomid: makeKey(), id: user._id, name: user.name}).json({status: 'OK', name: user.name});
        }
        catch(e){
            return res.status(400).json({error: true, message: e.toString()});
        }
    }

    static async logout(req, res, next) {
        console.log("LOGGING OUT");
        res.status(200).clearCookie("values").json({status: 'OK'});
    }

    // static async verifyUser(req, res) {
    //    try{
    //        var { email, key} = req.query;
    //        var emailUser = await userInfoSchema.findOne({email});
    //        var keyUser = await userInfoSchema.findOne({key});
    //        if(emailUser === null || keyUser === null){
    //            throw new Error("email or key is null")
    //        }
    //        if (emailUser._id.toString() != keyUser._id.toString()) {
    //            await userModel.deleteOne({email});
    //            throw new Error("user is not the same")
    //        }
    //        var curr_date = new Date();
    //        let result = {
    //            status: 'OK',
    //            email: email,
    //            date: curr_date,
    //        };
    //        return res.status(200).json({status: 'OK', name: emailUser.name});
    //    }catch(e){
    //        return res.status(400).json({error: true, message: e.toString()});
    //    }
    // }

    static async forgotUsername(req, res) {
        try{
            var { email } = req.body;

            var emailUser = await userInfoSchema.findOne({email});
            if(emailUser === null){
                throw new Error("email is null")
            }
            
            console.log("username", emailUser.username);
            // send username to email here
            // nodemailer stuff


            return res.status(200).json({status: 'OK', username: emailUser.username});
        }catch(e){
            // console.log("bad error", e);
            return res.status(400).json({error: true, message: e.toString()});
        }
    }

    static async sendPasswordRecoveryCode(req, res) {
        try{
            var { email } = req.body;

            var emailUser = await userInfoSchema.findOne({email});
            if(emailUser === null){
                throw new Error("email is null")
            }

            var code = makeKey();
            // add code to db of email user
            // send code to email here
            // nodemailer stuff

            return res.status(200).json({status: 'OK'});
        }catch(e){
            return res.status(400).json({error: true, message: e.toString()});
        }
    }

    static async changePassword(req, res) {
        try{
            var { code, password } = req.body;
            // check code if it exists in db

            return res.status(200).json({status: 'OK'});
        }catch(e){
            return res.status(400).json({error: true, message: e.toString()});
        }
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