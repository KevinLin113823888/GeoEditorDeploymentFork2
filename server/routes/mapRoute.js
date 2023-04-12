const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const MapController = require('../controllers/mapController')

router.get('/createMap', MapController.createMap);
// router.post('/getMapById', MapController.getMapById);
// router.post('/deleteMapById', MapController.deleteMapById);
// router.post('/duplicateMapById', MapController.duplicateMapById);
router.post('/changeMapNameById', MapController.changeMapNameById);
router.post('/publishMapById', MapController.publishMapById);

module.exports = router