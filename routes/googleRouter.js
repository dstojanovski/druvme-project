const express = require('express');
const UserModel = require('./../models/userModel');
const passport = require('passport');
const GoogleStrategy= require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');


const router = express.Router();

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
    await UserModel.findById(user=> {
        done(null, user);
    });
});




passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/google/auth/callback'
}, 
// After we are done  with this callback the user we have to call done().
(accessToken, refreshToken, profile, done) => {
    
    UserModel.findOne({ googleId: profile.id }).then((existingUser) =>{
        if (existingUser){
            done(null, existingUser);
            // we already have a record with a given profile ID
        } else {
            // we dont have user with this ID
            // WE creating new model and then call DONE() by providing the new creating user inside.
            new UserModel({ 
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            })
            .save({ validateBeforeSave: false })
            .then(user => done(null, user));
        }
    })
}
));

router.route('/').get(passport.authenticate('google', {
    scope:['profile', 'email']
}))

router.route('/callback').get(passport.authenticate('google', { 
    failureRedirect: '/' }),
    //   Successful authentication, redirect home.
    function(req, res) {
        // Send cookie withing the res after callback.
        const userId = (res.req.session.passport.user);

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                ),
              // Make cookie hardcoded into http protokol. Browser could not change it. Secure issue.
                httpOnly: true,

        }

        res.cookie('jwt', token, cookieOptions);
        //   Successful authentication, redirect home.
        res.redirect('/');
});

module.exports = router;