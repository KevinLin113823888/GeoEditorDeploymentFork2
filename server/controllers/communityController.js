var mongoose = require('mongoose');
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

class communityController {
    static async getCommunity(req, res) {
        try {
            let session = req.cookies.values;
            var mapCards = await MapCard.find({published:true});
            return res.status(200).json({status: "OK", mapcards: mapCards});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async getCommunityPreviewById(req, res) {
        try {
            var { id } = req.body;

            var currentCommunityPreview = await CommunityPreview.findOne({ mapCard: new mongoose.Types.ObjectId(id) });
            // console.log(currentCommunityPreview);
            var currentCommunityData = await MapData.findOne({ _id: currentCommunityPreview.mapData });
            var currentCommunityCard = await MapCard.findOne({ mapData: currentCommunityData._id });
            var currentOwner = await User.findOne({ _id: currentCommunityCard.owner });

            return res.status(200).json({
                status: "OK", 
                title: currentCommunityPreview.title,
                id: currentCommunityPreview._id,
                ownerName: currentOwner.username,
                type: currentCommunityData.type, 
                feature: JSON.stringify(currentCommunityData.feature), 
                comments: currentCommunityPreview.comments, 
                likes: currentCommunityPreview.likes, 
                dislikes: currentCommunityPreview.dislikes, 
                reports: currentCommunityPreview.reports
            });
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async forkCommunityMap(req, res) {
        try {
            var { id, newName } = req.body;

            var currentCommunityPreview = await CommunityPreview.findOne({ _id: new mongoose.Types.ObjectId(id) });
            var currentCommunityData = await MapData.findOne({ _id: new mongoose.Types.ObjectId(currentCommunityPreview.mapData) });
            var currentMapCard = await MapCard.findOne({ mapData: new mongoose.Types.ObjectId(currentCommunityData._id) });
            
            let mapCardObjId = new mongoose.Types.ObjectId();
            let mapDataObjId = new mongoose.Types.ObjectId();

            let mapDataObj = currentCommunityData.toObject();
            delete mapDataObj._id;
            mapDataObj._id = mapDataObjId
            var mapDataClone = new MapData(mapDataObj);
            await mapDataClone.save();

            let mapCardObj = currentMapCard.toObject();
            delete mapCardObj._id;
            mapCardObj._id = mapCardObjId;
            mapCardObj.title = newName;
            mapCardObj.mapData = mapDataObjId;
            mapCardObj.published = false;
            var mapCardClone = new MapCard(mapCardObj);
            await mapCardClone.save();

            var user = await User.findOneAndUpdate({ _id: currentMapCard.owner }, { $push: { ownedMapCards: mapCardObjId } });
            await user.save();

            return res.status(200).json({status: 'OK'});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async reportCommunityMap(req, res) {
        try {
            var { id, reportMessage } = req.body;

            var currentCommunityPreview = await CommunityPreview.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $push: { reports: reportMessage } });

            return res.status(200).json({status: 'OK'});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async likeCommunityMap(req, res) {
        try {
            var { id } = req.body;

            // var currentCommunityPreview = await 


        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async dislikeCommunityMap(req, res) {
        try {
            var { id } = req.body;

            // var currentCommunityPreview = await 


        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async followCommunityMap(req, res) {
        try {
            var { id } = req.body;
            let session = req.cookies.values;

            var currentUser = await findOneAndUpdate({ username: session.username}, { $push: { usersFollowing: id } });
            currentUser.save();
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async blockCommunityMap(req, res) {
        try {
            var { id } = req.body;
            let session = req.cookies.values;

            var currentUser = await findOneAndUpdate({ username: session.username}, { $push: { blockedUsers: id } });
            currentUser.save();
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async addComment(req, res) {

    }
};

module.exports = communityController;