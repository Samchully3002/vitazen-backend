const express = require('express');
const upload = require('../middleware/uploadPromo'); // promotion upload image
const { createPromo, editPromo, deletePromo, getPromotionById, getAllHeroBanner, getAllPromoBanner } = require('../controllers/promotionController');

const router = express.Router();

router.post(
  '/promotions',
  upload.fields([
    { name: 'image', maxCount: 1 }
  ]),
  createPromo
);

router.put(
  '/promotions/:id',
  upload.fields([
    { name: 'image', maxCount: 1 }
  ]),
  editPromo
);
router.delete('/promotions/:id', deletePromo);
router.get('/promotions/hero-banner',getAllHeroBanner);
router.get('/promotions/hero-banner/:id',getPromotionById);





router.get('/promotions/promo-banner',getAllPromoBanner);


module.exports = router;