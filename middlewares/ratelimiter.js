const rateLimit=require('express-rate-limit');
const ratelimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 500,
    message: "Too many requests from this IP, please try again later",
  });
  module.exports = {ratelimiter}