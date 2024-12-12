const express = require('express');
const upload = require('../middleware/uploadBlog'); // upload image middleware
const { createPost, editPost, deletePost } = require('../controllers/vsightControllers');

const router = express.Router();

// Create Vsight Post
router.post(
  '/vsight',
  upload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  createPost
);

// Edit Vsight Post
router.put('/vsight/:id', upload.single('image'), editPost);

// Delete Vsight Post
router.delete('/vsight/:id', deletePost);


module.exports = router;