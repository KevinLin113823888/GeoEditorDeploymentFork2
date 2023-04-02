const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");
const userInfoSchema = require("../models/userInfoModel");

class userController {
    static async getLoggedIn(req, res) {
        let session = req.cookies.values;

        var user = await userInfoSchema.findOne({username: session.username});
        // console.log("owned map cards of ", session.username, session.ownedMapCards);

        return res.status(200).json({status: 'OK', username: session.username, mapcards: user.ownedMapCards});
    }

    static async register(req, res) {
        try{
            var { name, username, email, password } = req.body;
            var user = await userInfoSchema.findOne({email});

            var key = makeKey();

            var hashpswd = await bcrypt.hash(password, 9);
            var user = new userInfoSchema({
                name,
                username,
                email,
                password: hashpswd,
                key: key, 
                ownedMaps: [], 
                ownedMapCards: [], 
                blockedUsers: [], 
                usersFollowing: []
            });
            await user.save();
            console.log("saved to db");
            return res.status(200).cookie("values", 
                {
                    id: user._id, 
                    username: user.username
                }
            ).json({status: 'OK', name: user.name});
            // return res.status(200).json({status: 'OK'});
        }
        catch (e){
            console.log(e.toString());
            if (!user)
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

            return res.status(200).cookie("values", 
                {
                    id: user._id, 
                    username: user.username
                }
            ).json({status: 'OK', name: user.name});
        }
        catch(e){
            return res.status(400).json({error: true, message: e.toString()});
        }
    }

    static async logout(req, res, next) {
        res.status(200).clearCookie("values").json({status: 'OK'});
    }

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