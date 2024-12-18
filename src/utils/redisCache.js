// utils/redisCache.js
const redisClient = require('../config/redis');

// Get data from Redis cache
const getCache = async (key) => {
  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

// Set data in Redis cache with a TTL (in seconds)
const setCache = async (key, value, ttl = 3600) => { // Default TTL is 1 hour
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
};

// Clear cache for a specific key (optional)
const clearCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error clearing cache for key ${key}:`, error);
  }
};

module.exports = {
  getCache,
  setCache,
  clearCache
};
