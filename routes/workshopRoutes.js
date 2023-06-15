const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController')
const {requireAuth} = require('../middleware/authMiddleware')
router.get('/addworkshop',workshopController.add_workshop_get);
router.post('/addworkshop',workshopController.add_workshop_post);
router.get('/allworkshops_i',workshopController.all_workshops_get_i);
router.get('/allworkshops_a',workshopController.all_workshops_get_a);
router.post('/allworkshops_a',requireAuth,workshopController.all_workshops_post_a);
router.post('/del_workshops',workshopController.del_workshop);
router.get('/myworkshops',workshopController.my_workshops_get);
module.exports = router;