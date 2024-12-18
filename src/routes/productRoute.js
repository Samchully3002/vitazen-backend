// /routes/productRoute.js

const express = require('express');
const productController = require('../controllers/productControllers.js');
const authenticateJWT = require('../middleware/auth.js');
const generateSlug = require('../middleware/slug.js');

const router = express.Router();

router.post('/products',authenticateJWT, productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:slug', productController.getProductBySlug);


module.exports = router;
