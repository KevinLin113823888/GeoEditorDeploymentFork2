var mongoose = require('mongoose');
const Map = require('../models/mapModel')
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

class communityController {
    static async getCommunity(req, res) {
        try {
            let session = req.cookies.values;
            var mapCards = await MapCard.find({published:true}); //.limit(50)
            console.log("community maps", mapCards);
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

        var currentCommunityPreview = CommunityPreview.find({ _id: mongoose.Types.ObjectId(id) });

        return res.status(200).json({status: "OK", title: currentCommunityPreview.title, });
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async forkCommunityMap(req, res) {
        try {
            var { id } = req.body;

            var currentCommunityPreview = CommunityPreview.find({ _id: mongoose.Types.ObjectId(id) });

            res.status(200);
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }
};

module.exports = communityController;