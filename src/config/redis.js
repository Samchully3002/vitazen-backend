// /config/redisClient.js
const redis = require('redis');

// Create and configure the Redis client
const client = redis.createClient({
  url: process.env.REDIS_HPST 
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
(async () => {
  await client.connect();
})();

module.exports = client;
