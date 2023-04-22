const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");
const userInfoSchema = require("../models/userInfoModel");
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')

class userController {
    static async getLoggedIn(req, res) {
        try{
            let username = req.session.username;

            var user = await userInfoSchema.findOne({username: username});

            // var mapcard_list = [];
            // for(let i = 0; i<user.ownedMapCards.length; i++){
            //     var card = await MapCard.findOne({_id: user.ownedMapCards[i]});
            //     // mapcard_list.push({title: card.title, id: card._id, image: card.mapImages, type: card.imageType})
            // }

            const mapCards = await MapCard.find({ '_id': { $in: user.ownedMapCards } });

            return res.status(200).json({status: 'OK', username: session.username, mapcards: mapCards});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
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
            req.session.username = user.username;
            console.log(req.session);
            return res.status(200).json({status: 'OK', name: user.name});
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
            
            req.session.username = user.username;
            console.log(req.session);
            return res.status(200).json({status: 'OK', name: user.name});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString()});
        }
    }

    static async logout(req, res, next) {
        try{
            req.session.destroy();
            return res.status(200).json({status: 'OK'});
        }catch (e){
            console.log(e)
            return res.status(400).clearCookie("values").json({status: e.toString()});
        }
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

            let passwordRecoveryCode = makeKey()
            await userInfoSchema.updateOne({email},{
                passwordRecoveryCode: passwordRecoveryCode
            })

            // send code to email here
            // nodemailer stuff

            return res.status(200).json({status: 'OK', passwordRecoveryCode: passwordRecoveryCode});
        }catch(e){
            return res.status(400).json({error: true, message: e.toString()});
        }
    }

    static async changePassword(req, res) {
        try{
            var { email,passwordRecoveryCode, password } = req.body;
            var emailUser = await userInfoSchema.findOne({email});

            if(emailUser.passwordRecoveryCode !== passwordRecoveryCode){
                throw new Error("invalid passwordRecoveryCode")
            }
            var hashpswd = await bcrypt.hash(password, 9);

            await userInfoSchema.updateOne({email},{
                password: hashpswd
            })

            // check code if it exists in db

            return res.status(200).json({status: 'OK'});
        }catch(e){
            return res.status(400).json({ error: true, message: e.toString()});
        }
    }

    static async deleteUser(req, res) {
        try{
            var { password } = req.body;
            let username = req.session.username;
            var user = await userInfoSchema.findOne({username: username});

            var isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch)
                throw new Error("Invalid password")
            
            let mapCards = await MapCard.find({_id:{$in:user.ownedMapCards}});

            for (let i = 0; i < mapCards.length; i++) {
                await MapData.deleteOne({_id: mapCards[i].mapData })
            }

            let deletedMapCards = await MapCard.deleteMany({_id:{$in:user.ownedMapCards}});
            await userInfoSchema.deleteOne({_id: user._id})

            return res.status(200).clearCookie("values").json({status: 'OK'});
        }
        catch(e){
            return res.status(400).json({error: true, message: e.toString()});
        }
    }

    // static async changeUsername(req, res) {
    //     try{
    //         var { code, password } = req.body;
    //         var emailUser = await userInfoSchema.findOne({email});
    //
    //         // check code if it exists in db
    //
    //         return res.status(200).json({status: 'OK'});
    //     }catch(e){
    //         return res.status(400).json({error: true, message: e.toString()});
    //     }
    // }

}

function makeKey() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

module.exports = userController;