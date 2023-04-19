var mongoose = require('mongoose');
const Map = require('../models/mapModel')
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

class communityController {
    static async getCommunity(req, res) {
        let session = req.cookies.values;
        var mapCards = await MapCard.find({published:true}); //.limit(50)
        console.log("community maps", mapCards);

        return res.status(200).json({status: "OK", mapcards: mapCards});
    }

    static async getCommunityPreviewById(req, res) {
        var { id } = req.body;

        var currentCommunityPreview = CommunityPreview.find({ _id: mongoose.Types.ObjectId(id) });

        return res.status(200).json({status: "OK", title: currentCommunityPreview.title, });
    }

    static async forkCommunityMap(req, res) {
        var { id } = req.body;

        var currentCommunityPreview = CommunityPreview.find({ _id: mongoose.Types.ObjectId(id) });

        res.status(200);
    }
};

module.exports = communityController;