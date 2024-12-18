//controllers/landing/vsight.js

const Vsight = require('../../models/vsight');
const { getCache, setCache } = require('../../utils/redisCache');

const moment = require('moment'); // For date formatting
require('moment/locale/id'); // Set locale for Bahasa Indonesia
const path = require('path');


// Get all sight
exports.getAllSight = async (req, res) => {
    try {
        const { page , limit } = req.body;
    
        // Convert `page` and `limit` to numbers
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
    
        // Calculate the total number of documents
        const totalItems = await Vsight.countDocuments({active:true});
    
        // Fetch paginated products
        const vsights = await Vsight.find({active:true})
          .select('title slug body image')
          .sort({ createdAt: -1 }) // Sort by creation date (newest first)
          .skip((pageNumber - 1) * limitNumber) // Skip products based on the current page
          .limit(limitNumber); // Limit products per page

          const formatVsight = vsights.map((v) => ({
            ...v.toObject(),
            createdAt: moment(v.createdAt).format('DD MMMM YYYY'), // Format creation date
            image: `${req.protocol}://${req.get('host')}/uploads/blog/${path.basename(v.image)}`,
          }));
    
        // Calculate total pages
        const totalPages = Math.ceil(totalItems / limitNumber);
    
        res.status(200).json({
          success: true,
          currentPage: pageNumber,
          totalPages,
          totalItems,
          vsights:formatVsight,
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
      // const cachedSlugSight = await getCache(cacheKey);
      // if (cachedSlugSight) {
      //   return res.status(200).json(cachedSlugSight);
      // }
  
      // If not in cache, fetch from MongoDB
      const sight = await Vsight
      .findOne({ slug:slug })
      
      if (!sight) {
        return res.status(404).json({ message: 'Sight not found' });
      }

      const formatSight = {
        ...sight.toObject(), // Convert Mongoose document to a plain object
        createdAt: moment(sight.createdAt).format('DD MMMM YYYY'), // Format creation date
        image: `${req.protocol}://${req.get('host')}/uploads/blog/${path.basename(sight.image)}`,
      };
  
      // Store fetched data in Redis
      //await setCache(cacheKey, sight, 3600); // Cache for 1 hour
  
      res.status(200).json(formatSight);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sight', error: error.message });
    }
  };


