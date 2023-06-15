const express = require('express');
const router = express.Router();
const instructorAuthController = require('../controllers/instructorAuthController')
router.get('/instructorlogin',instructorAuthController.login_get);
router.get('/instructorlogout',instructorAuthController.logout_get);
router.post('/instructorlogin',instructorAuthController.login_post);
router.post('/instructorsignup',instructorAuthController.signup_post);
module.exports=router;