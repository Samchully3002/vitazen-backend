const express = require('express');
const upload = require('../middleware/uploadPromo'); // promotion upload image
const { createPromo, getAllHeroBanner, getAllPromoBanner } = require('../controllers/promotionController');

const router = express.Router();

router.post(
  '/promotions',
  upload.fields([
    { name: 'image', maxCount: 1 }
  ]),
  createPromo
);

router.get('/promotions/hero-banner',getAllHeroBanner);
router.get('/promotions/promo-banner',getAllPromoBanner);


module.exports = router;