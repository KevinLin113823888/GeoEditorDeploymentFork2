const Map = require('../models/mapModel')
const User = require('../models/userInfoModel');
const MapCard = require('../models/mapCardModel')
const MapData = require('../models/mapDataModel')
const CommunityPreview = require('../models/communityPreviewModel')

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