const express = require('express')
const router = express.Router()
//const auth = require('../auth')
const MapController = require('../controllers/mapController')

router.post('/createMap', MapController.createMap);
// router.post('/getMapById', MapController.getMapById);
// router.post('/deleteMapById', MapController.deleteMapById);
router.post('/duplicateMapById', MapController.duplicateMapById);
router.post('/changeMapNameById', MapController.changeMapNameById);
router.post('/publishMapById', MapController.publishMapById);
router.post('/mapClassificationById', MapController.mapClassificationById);
router.post('/importMapFileById', MapController.importMapFileById);
router.post('/saveMapById', MapController.saveMapById);

module.exports = router