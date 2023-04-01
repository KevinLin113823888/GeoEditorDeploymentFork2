var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController.js');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
