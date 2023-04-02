const Map = require('../models/mapModel')
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

class mapController {
    static async createMap(req, res) {
        // const body = req.body;
        // console.log("createMap body: " + JSON.stringify(body));
    
        // if (!body) {
        //     return res.status(400).json({
        //         success: false,
        //         error: 'You must provide a Map',
        //     })
        // }
        // console.log(body.title)
        // const map = new Map();
        // if (!map) {
        //     return res.status(400).json({ success: false, error: err })
        // }

        try{
            
            var { title } = req.body;
            let session = req.cookies.values;
            var owner = await User.findOne({username: session.username});
            var newMap = new Map({
                title: title,
                owner: owner._id
            })
            
            
            await newMap.save();

            console.log(title)
            
            var newMapCard = new MapCard({
                title: title,
                map: newMap._id
            })
            
            await newMapCard.save()
            
            owner.ownedMaps.push(newMap._id);
            
            owner.ownedMapCards.push(newMapCard._id);

            await owner.save()
            console.log(newMap._id.toString())
            return res.status(200).json({status: 'OK', title: title, mapId: newMap._id.toString() });
        }
        catch(e){
            return res.status(400).json({error: true, message: e.toString() });
        }
    }
}

module.exports = mapController;