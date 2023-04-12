var mongoose = require('mongoose');
const Map = require('../models/mapModel')
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

class mapController {
    static async createMap(req, res) {
        try{
            var { title } = req.body;
            let session = req.cookies.values;
            var owner = await User.findOne({username: session.username});

            var newMap = new Map({
                title: title,
                owner: owner._id,
                published: false
            });
            
            await newMap.save();

            console.log(title);
            
            var newMapCard = new MapCard({
                title: title,
                map: newMap._id
            })
            
            await newMapCard.save();
            
            owner.ownedMaps.push(newMap._id);
            
            owner.ownedMapCards.push(newMapCard._id);

            await owner.save();
            console.log(newMap._id.toString());
            return res.status(200).json({status: 'OK', title: title, mapId: newMap._id.toString()});
        }
        catch(e){
            return res.status(400).json({error: true, message: e.toString() });
        }
    }

    static async getMapById(req, res) {
        var { id } = req.body;

        var currentMap = Map.findOne({ _id: newmongoose.Types.ObjectId(id) });
        var currentMapData = MapData.findOne({ _id: currentMap.mapData });

        return res.status(400).json({status: 'OK', title: currentMap.title});
    }

    static async deleteMapById(req, res) {
        var { id } = req.body;

        var id = mongoose.Types.ObjectId(id);
        var mapCard = MapCard.findOneAndDelete({ _id: id });
        var map = Map.findOneAndDelete({ _id: mapCard._id });
        var mapData = MapData.findOneAndDelete({ _id: map._id });

        User.findOneAndUpdate({_id: id}, { $pull: {ownedMapCards: mapCards._id, ownedMaps: map._id} });

        return res.status(400).json({status: 'OK'});
    }

    static async duplicateMapById(req, res) {
        var { id } = req.body;

        var currentMapCard = MapCard.findOne({ _id: new mongoose.Types.ObjectId(id) });

        var currentMap = Map.findOne({ _id: currentMapCard._id });
        
        var currentMapData = MapData.findOne({ _id: currentMap._id });

        currentMapCard._id = new mongoose.Types.ObjectId();
        currentMap._id = new mongoose.Types.ObjectId();
        currentMapData._id = new mongoose.Types.ObjectId();

        currentMapCard.map = currentMap._id;
        currentMap.mapData = currentMapData._id;

        MapCard.insert(currentMapCard);
        Map.insert(currentMap);
        MapData.insert(currentMapData);

        return res.status(400).json({status: 'OK'});
    }

    static async changeMapNameById(req, res) {
        var { id, newName } = req.body;
        var currentMapCard = await MapCard.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { title: newName });
        await currentMapCard.save();
        var updatedMap = await Map.findOneAndUpdate({ _id: currentMapCard.map }, { title: newName });
        await updatedMap.save();

        return res.status(400).json({status: 'OK'});
    }

    static async publishMapById(req, res) {
        var { id } = req.body;
        var currentMapCard = await MapCard.findOne({ _id: new mongoose.Types.ObjectId(id) });
        var currentMap = await Map.findOneAndUpdate({ _id: currentMapCard.map }, { published: true });
        await currentMap.save();
        var newCommunityPreview = new CommunityPreview({
            mapData: currentMap.mapData
        });
        await newCommunityPreview.save();
        return res.status(400).json({status: 'OK'});
    }
}

module.exports = mapController;