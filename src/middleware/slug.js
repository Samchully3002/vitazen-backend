const slugify = require('slugify'); // Import a library to generate slugs

const generateSlug = (req, res, next) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, { lower: true }); // Generate slug from the product name
  } else {
    return res.status(400).json({ message: "Product name is required!" });
  }
  next(); // Continue to the next middleware/controller
  };
  
module.exports = generateSlug;

  