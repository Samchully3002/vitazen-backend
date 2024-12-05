
const express = require('express');
const discountController = require('../controllers/discountControllers.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();

router.post('/discounts',authenticateJWT, discountController.createDiscount);
router.get('/discounts', discountController.getAllDiscount);


module.exports = router;