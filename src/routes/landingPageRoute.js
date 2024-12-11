const express = require('express');
const homeController = require('../controllers/landing/home.js');
const vsightController = require('../controllers/landing/vsight.js');
const productController = require('../controllers/landing/product.js');
const contactController = require('../controllers/landing/contactus.js');




const router = express.Router();


// Home
router.get('/home/getproducts', homeController.getHomeProducts);
router.get('/home/getsights', homeController.getHomeSight);
    //== review section ==/
    router.get('/home/getreviews', homeController.getAllReviewWeb);
    router.get('/home/getvideoreviews', homeController.getAllVideoAd);

// Product
router.get('/products', productController.getAllProducts); 
router.get('/products/:slug', productController.getProductBySlug);

//Vsight
router.get('/vsights', vsightController.getAllSight);
router.get('/vsights/:slug', vsightController.getSightBySlug);

//Contact Us
router.get('/messages', contactController.getAllMessage);
router.post('/messages', contactController.submitMessage);




module.exports = router;