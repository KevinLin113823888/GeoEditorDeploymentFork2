const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const MapController = require('../controllers/map-controller')

router.post('/map',MapController.createMap)

module.exports = router