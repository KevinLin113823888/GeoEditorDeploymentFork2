const express = require('express');
const router = express.Router();
const CommunityController = require('../controllers/communityController');
const auth = require('../auth');

router.get('/getCommunity', auth.verify, CommunityController.getCommunity);
router.post('/getCommunityPreviewById', auth.verify, CommunityController.getCommunityPreviewById);
router.post('/forkCommunityMap', auth.verify, CommunityController.forkCommunityMap);
router.post('/reportCommunityMap', auth.verify, CommunityController.reportCommunityMap);
router.post('/likeCommunityMap', auth.verify, CommunityController.likeCommunityMap);
router.post('/dislikeCommunityMap', auth.verify, CommunityController.dislikeCommunityMap);
router.post('/followCommunityMap', auth.verify, CommunityController.followCommunityMap);
router.post('/blockCommunityMap', auth.verify, CommunityController.blockCommunityMap);
router.post('/addComment', auth.verify, CommunityController.addComment);
router.post('/searchMap', auth.verify, CommunityController.addComment);

module.exports = router