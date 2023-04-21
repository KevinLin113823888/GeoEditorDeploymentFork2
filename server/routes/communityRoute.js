const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const CommunityController = require('../controllers/communityController')

router.get('/getCommunity', CommunityController.getCommunity);
router.post('/getCommunityPreviewById', CommunityController.getCommunityPreviewById);
router.post('/forkCommunityMap', CommunityController.forkCommunityMap);
// router.post('/downloadCommunityMap', CommunityController.downloadCommunityMap);
router.post('/reportCommunityMap', communityController.reportCommunityMap);
router.post('/likeCommunityMap', communityController.likeCommunityMap);
router.post('/dislikeCommunityMap', communityController.dislikeCommunityMap);
router.post('/followCommunityMap', communityController.followCommunityMap);


module.exports = router