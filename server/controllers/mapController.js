var mongoose = require('mongoose');
const Map = require('../models/mapModel')
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

class mapController {
    static async createMap(req, res) {
        // try{
        var { title } = req.body;
        console.log("creating map", title);
        let session = req.cookies.values;

        var owner = await User.findOne({username: session.username});
        console.log("owner", owner.name);
        var newMap = new Map({
            title: title,
            owner: owner._id,
            published: false
        });
        await newMap.save();      

        var newMapCard = new MapCard({
            title: title,
            map: newMap._id
        })
        await newMapCard.save();

        owner.ownedMaps.push(newMap._id);
        owner.ownedMapCards.push(newMapCard._id);
        await owner.save();
        
        return res.status(200).json({status: 'OK', title: title, mapId: newMap._id.toString()});
        // }
        // catch(e){
        //     return res.status(400).json({error: true, message: e.toString() });
        // }
    }

    // not tested yet
    static async getMapById(req, res) {
        var { id } = req.body;

        var currentMap = Map.findOne({ _id: new mongoose.Types.ObjectId(id) });
        var currentMapData = MapData.findOne({ _id: currentMap.mapData });

        return res.status(200).json({status: 'OK', title: currentMap.title});
    }

    // not tested yet
    static async deleteMapById(req, res) {
        var { id } = req.body;

        var id = mongoose.Types.ObjectId(id);
        var mapCard = MapCard.findOneAndDelete({ _id: id });
        var map = Map.findOneAndDelete({ _id: mapCard._id });
        var mapData = MapData.findOneAndDelete({ _id: map._id });
        User.findOneAndUpdate({_id: id}, { $pull: {ownedMapCards: mapCards._id, ownedMaps: map._id} });

        return res.status(200).json({status: 'OK'});
    }

    static async duplicateMapById(req, res) {
        var { id, newName } = req.body;

        var currentMapCard = await MapCard.findOne({ _id: new mongoose.Types.ObjectId(id) });
        var currentMap = await Map.findOne({ _id: currentMapCard.map });
        // var currentMapData = await MapData.findOne({ _id: currentMap.mapData });

        let mapObjId = new mongoose.Types.ObjectId();
        let mapCardObjId = new mongoose.Types.ObjectId();

        let mapObj = currentMap.toObject();
        mapObj._id = mapObjId;
        mapObj.title = newName;
        const mapClone = new Map(mapObj);
        await mapClone.save();

        let mapCardObj = currentMapCard.toObject();
        delete mapCardObj._id;
        mapCardObj.map = mapCardObjId;
        mapCardObj.title = newName;
        const mapCardClone = new MapCard(mapCardObj);
        await mapCardClone.save();

        return res.status(200).json({status: 'OK'});
    }

    static async changeMapNameById(req, res) {
        var { id, newName } = req.body;
        console.log(id, newName)

        var currentMapCard = await MapCard.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { title: newName });
        await currentMapCard.save();
        var updatedMap = await Map.findOneAndUpdate({ _id: currentMapCard.map }, { title: newName });
        await updatedMap.save();

        return res.status(200).json({status: 'OK'});
    }

    static async publishMapById(req, res) {
        var { id } = req.body;

        // var currentMapCard = await MapCard.findOne({ _id: new mongoose.Types.ObjectId(id) });
        var currentMap = await Map.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { published: true });
        await currentMap.save();
        var newCommunityPreview = new CommunityPreview({
            mapData: currentMap.mapData
        });
        await newCommunityPreview.save();

        return res.status(200).json({status: 'OK'});
    }

    static async mapClassificationById(req, res) {
        var { id, classifications } = req.body;

        let listOfClass = classifications.split(", ");
        var currentMapCard = await MapCard.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { classification: listOfClass });
        await currentMapCard.save();

        return res.status(200).json({status: 'OK'});
    }

    static async importMapFileById(req, res) {
        var { id, geoJSONFile } = req.body;

        console.log("geojson type", geoJSONFile.type);
        console.log("feature 1", geoJSONFile.features[0].type);
        // var currentMapCard = await MapCard.findOne({ _id: id });
        
        var newMapData = new MapData({
            type: JSON.stringify(geoJSONFile.type),
            features: JSON.stringify(geoJSONFile.features)
        })
        await newMapData.save(); 

        return res.status(200).json({status: 'OK'});
    }

    static async saveMapById(req, res) {
        var { id, map } = req.body;
    }
}

module.exports = mapController;