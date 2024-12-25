// /routes/productRoute.js

const express = require('express');
const productController = require('../controllers/productControllers.js');
const authenticateJWT = require('../middleware/auth.js');
const generateSlug = require('../middleware/slug.js');

const router = express.Router();

router.post('/products', productController.createProduct);
router.put('/products/:id', productController.editProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:slug', productController.getProductBySlug);
router.get('/productsid/:id', productController.getProductIdentityNumber);


module.exports = router;
