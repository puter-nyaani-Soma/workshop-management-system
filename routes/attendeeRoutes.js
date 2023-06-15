const express = require('express');
const router = express.Router();
const attendeeController = require('../controllers/attendeeController')
router.get('/login',attendeeController.login_get);
router.get('/logout',attendeeController.logout_get);
router.post('/login',attendeeController.login_post);
router.post('/signup',attendeeController.signup_post);
module.exports=router;