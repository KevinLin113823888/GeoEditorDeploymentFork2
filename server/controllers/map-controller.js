const Map = require('../models/map-model')
const User = require('../models/userInfo-model');
const MapCard = require('../models/mapCard-model')
const MapData = require('../models/mapData-model')
const CommunityPreview = require('../models/communityPreview-model')

createMap = (req, res) => {
    const body = req.body;
    console.log("createMap body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Map',
        })
    }
    console.log(body.title)
    const map = new Map();
    if (!map) {
        return res.status(400).json({ success: false, error: err })
    }


}