const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const MapController = require('../controllers/mapController')

router.post('/createMap', MapController.createMap);

module.exports = router