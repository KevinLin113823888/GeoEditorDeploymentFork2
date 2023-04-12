const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const CommunityController = require('../controllers/communityController')

router.get('/getCommunity', CommunityController.getCommunity);
// router.get('/getCommunityPreviewById', CommunityController.getCommunityPreviewById);
// router.post('/forkCommunityMap', CommunityController.forkCommunityMap);

module.exports = router