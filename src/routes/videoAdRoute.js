const express = require('express');
const upload = require('../middleware/uploadVideoAd'); // ad upload video middleware
const { adVideoAd, adVideoStream } = require('../controllers/videoAdController');

const router = express.Router();

router.post(
  '/videoads',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  adVideoAd
);

router.get('/videoads/:filename', adVideoStream); 

module.exports = router;
