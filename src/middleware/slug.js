const slugify = require('slugify'); // Import a library to generate slugs

const generateSlug = (req, res, next) => {
  const text = req.body.name || req.body.title; // Use either name or title
  if (text) {
    req.body.slug = slugify(text, { lower: true }); // Generate slug from the text
  } else {
    return res.status(400).json({ message: "Either product name or title is required!" });
  }
  next(); // Continue to the next middleware/controller
};

module.exports = generateSlug;
