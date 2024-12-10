//controllers/landing/vsight.js

const Vsight = require('../../models/vsight');
const { getCache, setCache } = require('../../utils/redisCache');


// Get all sight
exports.getAllSight = async (req, res) => {
    try {
        const { page , limit } = req.body;
    
        // Convert `page` and `limit` to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        // Calculate the total number of documents
        const totalItems = await Vsight.countDocuments();
    
        // Fetch paginated products
        const vsights = await Vsight.find()
          .select('title slug body image')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
          .limit(limitNumber); // Limit products per page
    
        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limitNumber);
    
        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          vsights,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error fetching vsight for landing page',
          error: error.message,
        });
      }
};

// Get sight by slug

exports.getSightBySlug = async (req, res) => {
    const { slug } = req.params;
    const cacheKey = `sight:${slug}`;
    try {
      // Check Redis cache
      const cachedSlugSight = await getCache(cacheKey);
      if (cachedSlugSight) {
        return res.status(200).json(cachedSlugSight);
      }
  
      // If not in cache, fetch from MongoDB
      const sight = await Vsight
      .findOne({ slug:slug })
      
      if (!sight) {
        return res.status(404).json({ message: 'Sight not found' });
      }
  
      // Store fetched data in Redis
      await setCache(cacheKey, sight, 3600); // Cache for 1 hour
  
      res.status(200).json(sight);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sight', error: error.message });
    }
  };


