const express = require('express');
const jwt = require("jsonwebtoken")
const passport = require('passport');
const { User } = require('../models/user');
const { ratelimiter } = require('../middlewares/ratelimiter');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require("dotenv").config()

const userRouter = express.Router();
userRouter.use(ratelimiter);

// Passport configuration using GoogleStrategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, {
      name: profile.displayName,
      email: profile.email,
      googleId: profile.id,
      avatar: profile.picture
    });
  }
));

// Serialize user information
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
// Deserialize user information
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Google OAuth2 authentication route
userRouter.get('/google', passport.authenticate('google', { scope: ['profile', "email"] }));

// Callback route after Google authentication
userRouter.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login' 
  }),
  async function(req, res) {
    try {
        let user = await User.findOne({ email: req.user.email })
        if (!user) {
            user = await User.create(req.user)
            return res.redirect(`http://localhost:3000/login?client=${user._id}`)
        }
        return res.redirect(`http://localhost:3000/login?client=${user._id}`)
    } catch (error) {
        return res.send({ error: error.message })
    }
  }
);

// Get user information by userId
userRouter.get("/user/:userId", async (req, res)=>{
    try {
        const { userId } = req.params
        
        let user = await User.findById(userId).select('email avatar name')

        if (!user) return res.status(404).send({ message: "User not found!", isOk: false })

        const token = jwt.sign({ userId: user._id }, process.env.JWT, { expiresIn: "15d" })
       
        return res.status(200).send({ isOk: true, message: "Here is user", user, token })
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error!", isOk: false })
    }
})

module.exports = { userRouter, passport }
