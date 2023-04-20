var mongoose = require('mongoose');
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

class mapController {
    static async createMap(req, res) {
        try {
            var { title } = req.body;
            console.log("creating map", title);
            let session = req.cookies.values;

            var owner = await User.findOne({username: session.username});
            console.log("owner", owner.name);
            
            var newMapData = new MapData({
                type: " ", 
                feature: []
            })
            await newMapData.save();

            var newMapCard = new MapCard({
                title: title,
                owner: owner._id,
                published: false, 
                mapData: newMapData._id
            })
            await newMapCard.save();

            owner.ownedMapCards.push(newMapCard._id);
            await owner.save();
            
            return res.status(200).json({status: 'OK', title: title, mapCardId: newMapCard._id.toString()});
        }
        catch(e){
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async getMapById(req, res) {
        try {
            var { id } = req.body;

            var currentMapCard = await MapCard.findOne({ _id: new mongoose.Types.ObjectId(id) });
            var currentMapData = await MapData.findOne({ _id: currentMapCard.mapData });

            console.log("features of the map", currentMapData.feature, currentMapData.type);

            return res.status(200).json({status: 'OK', title: currentMapCard.title, type: currentMapData.type, feature: JSON.stringify(currentMapData.feature) });
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    // not tested yet
    static async deleteMapById(req, res) {
        try {
            var { id } = req.body;

            var id = mongoose.Types.ObjectId(id);
            var mapCard = MapCard.findOneAndDelete({ _id: id });
            User.findOneAndUpdate({_id: id}, { $pull: {ownedMapCards: mapCard._id} });

            return res.status(200).json({status: 'OK'});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }
    
    // duplicate map still no work, need to also add mapdata
    static async duplicateMapById(req, res) {
        try {
            var { id, newName } = req.body;

            var currentMapCard = await MapCard.findOne({ _id: new mongoose.Types.ObjectId(id) });
            let mapCardObjId = new mongoose.Types.ObjectId();

            let mapCardObj = currentMapCard.toObject();
            delete mapCardObj._id;
            mapCardObj.map = mapCardObjId;
            mapCardObj.title = newName;
            const mapCardClone = new MapCard(mapCardObj);
            await mapCardClone.save();

            return res.status(200).json({status: 'OK'});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async changeMapNameById(req, res) {
        try {
            var { id, newName } = req.body;

            var currentMapCard = await MapCard.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { title: newName });
            await currentMapCard.save();

            return res.status(200).json({status: 'OK', name: newName});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async publishMapById(req, res) {
        try {
            var { id } = req.body;
            var currentMapCard = await MapCard.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { published: true });
            var newCommunityPreview = new CommunityPreview({
                mapData: currentMapCard.mapData
            });
            await newCommunityPreview.save();

            return res.status(200).json({status: 'OK'});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async mapClassificationById(req, res) {
        try {
            var { id, classifications } = req.body;

            let listOfClass = classifications.split(", ");
            var currentMapCard = await MapCard.findOneAndUpdate({ map: new mongoose.Types.ObjectId(id) }, { classification: listOfClass });
            await currentMapCard.save();

            return res.status(200).json({status: 'OK'});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async importMapFileById(req, res) {
        try {
            var { id, geoJSONFile } = req.body;

            var currentMapCard = await MapCard.findOne({ _id: id });
            var currentMapData = await MapData.findOneAndUpdate({ _id: currentMapCard.mapData }, { type: geoJSONFile.type, feature: geoJSONFile.features })
            // var newMapData = new MapData({
            //     type: geoJSONFile.type,
            //     feature: geoJSONFile.features,
            // })
            // await newMapData.save(); 
            await currentMapData.save()

            return res.status(200).json({status: 'OK'});
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async saveMapById(req, res) {
        try {
        var { id, map } = req.body;
        }
        catch(e){
            console.log(e.toString())
            return res.status(400).json({error: true, message: e.toString() });
        }
    }
}

module.exports = mapController;