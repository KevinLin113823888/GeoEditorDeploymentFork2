var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController.js');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/forgotUsername', userController.forgotUsername);
router.post('/sendPasswordRecoveryCode', userController.sendPasswordRecoveryCode);
router.post('/changePassword', userController.changePassword);
router.get('/loggedIn', userController.getLoggedIn);
module.exports = router;
