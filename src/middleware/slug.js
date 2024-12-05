const generateSlug = (req, res, next) => {
    if (req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    next(); // Pass control to the next middleware or route handler
  };
  
  module.exports = generateSlug;
  