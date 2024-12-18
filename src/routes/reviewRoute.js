const express = require('express');
const upload = require('../middleware/uploadReview'); // middleware upload yang dibuat sebelumnya
const { addReviewWeb } = require('../controllers/reviewController');

const router = express.Router();

router.post(
  '/reviews',
  upload.fields([
    { name: 'photos', maxCount: 3 },
    { name: 'videos', maxCount: 3 },
  ]),
  addReviewWeb
);

module.exports = router;
