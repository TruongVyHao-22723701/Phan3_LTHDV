const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.renderRegister);
router.post('/register', authController.register);

router.get('/login', authController.renderLogin);
router.post('/login', authController.login);

router.get('/forgot', authController.renderForgot);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;
