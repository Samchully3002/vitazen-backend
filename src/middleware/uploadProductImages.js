const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create a folder based on the product slug
    let productDir = req.body.identityNumber; // slug is in the request body
    productDir.replace(/^\/+/, '');
    //const uploadPath = `uploads/products/${productSlug}`; // Folder will be named after the slug
    const uploadPath = path.join('uploads', 'products', productDir);

    // Ensure the directory exists, if not, create it
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Use original filename with a timestamp to avoid overwriting
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  }
});

// Set up file filter (accept only image files)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer upload limits and filters
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // Max file size 5MB
});

// Middleware to upload single thumbnail image and multiple images for products
const uploadProductImages = upload.fields([
  { name: 'thumbnail', maxCount: 1 }, // Only 1 thumbnail
  { name: 'images', maxCount: 5 }      // Up to 5 additional images
]);

module.exports = uploadProductImages;
