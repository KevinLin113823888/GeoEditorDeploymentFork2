var express = require('express');
var router = express.Router();

var userController = require('../controllers/mapController.js');
router.get('/map', userController.map);

module.exports = router;