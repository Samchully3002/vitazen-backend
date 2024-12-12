//controllers/videoAdController.js

const ReviewAd = require('../models/reviewAd');
const fs = require('fs');
const path = require('path');

// Create new video ads review
exports.adVideoAd = async (req, res) => {
  try {

      const { name, active } = req.body;
      
      // Process uploaded files
      const thumbnailPath = req.files.thumbnail[0].path;
      const videoPath = req.files.video[0].path;
  
      const newVideo = new ReviewAd({
        name,
        active,
        thumbnail: thumbnailPath,
        video: videoPath
      });
  
      await newVideo.save();

    res.status(201).json({ message: 'Review added successfully', newVideo });
  } catch (error) {
    res.status(500).json({ message: 'Error saving review', error: error.message });
  }
};

// Streaming video
exports.adVideoStream = async (req, res) => {
  const { filename } = req.params;
  const videoPath = path.join('uploads','videos', filename);

  // Periksa apakah file ada
  if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video not found');
  }

  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const range = req.headers.range;

  if (range) {
      // if header do streaming parsial
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
          res.status(416).send('Requested range not satisfiable');
          return;
      }

      const chunkSize = end - start + 1;
      const videoStream = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'video/mp4',
      });

      videoStream.pipe(res);
  } else {
      // if no range header, sent all content
      res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
      });

      fs.createReadStream(videoPath).pipe(res);
  }
};

