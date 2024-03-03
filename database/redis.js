const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({
  host: 'localhost', 
  port: 6379, 
  password: '', 
});


module.exports = redisClient
