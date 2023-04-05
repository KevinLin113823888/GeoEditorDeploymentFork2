const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const CommunityController = require('../controllers/communityController')

router.post('/getCommunity', CommunityController.getCommunity);

module.exports = router