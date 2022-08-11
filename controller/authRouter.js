const express = require("express");
const passport = require("passport");
const loginRouter = express.Router();

// @desc  Auth with Google
// @route get /auth/google
loginRouter.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc  Google auth callback
// @route get /auth/google/callback
loginRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) =>
  res.redirect("/dashboard")
);

// @desc  Logout User
// @route /auth/logout
loginRouter.get("/logout", (req, res) => {
  req.logout((err, next) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = loginRouter;
