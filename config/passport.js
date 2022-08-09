const googleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

const credentialWithCallback = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
};

const verify = async (accessToken, refreshToken, profile, done) => {
  // console.log(profile);
  const newUser = new User({
    googleId: profile.id,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    image: profile.photos[0].value,
  });
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) user = await User.create(newUser);
    done(null, user);
  } catch (error) {
    console.error(error);
  }
};
// https://www.passportjs.org/packages/passport-google-oauth20/
module.exports = (passport) => {
  passport.use(new googleStrategy(credentialWithCallback, verify));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
};
