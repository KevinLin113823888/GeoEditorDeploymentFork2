const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const MapController = require('../controllers/mapController')

router.post('/createMap', MapController.createMap);
router.post('/deleteMapById', MapController.deleteMapById);
router.post('/duplicateMapById', MapController.duplicateMapById);
router.post('/changeMapNameById', MapController.changeMapNameById);

module.exports = router