
const express = require('express');
const dashboardController = require('../controllers/dashboardController.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();

router.get('/dashboard-product/', dashboardController.getProducts);
router.get('/dashboard-promo/', dashboardController.getPromotions);
router.get('/dashboard-review/', dashboardController.getReviews);


module.exports = router;