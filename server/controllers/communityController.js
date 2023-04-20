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
            console.log(currentCommunityPreview);
            var currentCommunityData = await MapData.findOne({ _id: currentCommunityPreview.mapData });

            return res.status(200).json({
                status: "OK", 
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
            var { id } = req.body;

            var currentCommunityPreview = CommunityPreview.find({ _id: new mongoose.Types.ObjectId(id) });

            res.status(200);
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }
};

module.exports = communityController;