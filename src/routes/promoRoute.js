const express = require('express');
const upload = require('../middleware/uploadPromo'); // promotion upload image
const { createPromo } = require('../controllers/promotionController');

const router = express.Router();

router.post(
  '/promotions',
  upload.fields([
    { name: 'image', maxCount: 1 }
  ]),
  createPromo
);



module.exports = router;