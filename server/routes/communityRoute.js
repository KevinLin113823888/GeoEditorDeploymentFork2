const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const CommunityController = require('../controllers/communityController')

router.get('/getCommunity', CommunityController.getCommunity);
router.post('/getCommunityPreviewById', CommunityController.getCommunityPreviewById);
router.post('/forkCommunityMap', CommunityController.forkCommunityMap);
router.post('/reportCommunityMap', CommunityController.reportCommunityMap);
router.post('/likeCommunityMap', CommunityController.likeCommunityMap);
router.post('/dislikeCommunityMap', CommunityController.dislikeCommunityMap);
router.post('/followCommunityMap', CommunityController.followCommunityMap);
router.post('/blockCommunityMap', CommunityController.blockCommunityMap);
router.post('/addComment', CommunityController.addComment);

module.exports = router