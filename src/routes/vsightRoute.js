const express = require('express');
const uploadBlog = require('../middleware/uploadBlog'); // upload image middleware
const { createPost, editPost, deletePost, getAllSight, getSightById } = require('../controllers/vsightControllers');

const router = express.Router();

// Create Vsight Post
router.post(
  '/vsight',
  uploadBlog.fields([
    { name: 'image', maxCount: 1 },
  ]),
  createPost
);

router.get('/vsight/:id', getSightById);

// Edit Vsight Post
router.put('/vsight/:id', (req, res, next) => {
  uploadBlog.single('image')(req, res, (err) => {
      if (err) {
          console.error('Multer Error:', err);
          return res.status(500).send('File upload failed');
      }
      next();
  });
}, editPost);

// Delete Vsight Post
router.delete('/vsight/:id', deletePost);

// Delete Vsight Post
router.get('/vsight', getAllSight);


module.exports = router;