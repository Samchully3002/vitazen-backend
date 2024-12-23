
const express = require('express');
const discountController = require('../controllers/discountControllers.js');
const authenticateJWT = require('../middleware/auth.js');


const router = express.Router();

router.post('/discounts', discountController.createDiscount);
router.get('/discounts/:id', discountController.getDiscountById);
router.put('/discounts/:id', discountController.editDiscount);
router.delete('/discounts/:id', discountController.deleteDiscount);
router.get('/discounts', discountController.getAllDiscount);


module.exports = router;