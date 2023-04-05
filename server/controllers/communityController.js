const CommunityPreview = require('../models/mapModel');

class communityController {
    static async getCommunity(req, res) {
        let session = req.cookies.values;
        // var communityMaps = await CommunityPreview.find().limit(50);
        return res.status(200).json({status: "OK"});
    }
};

module.exports = communityController;