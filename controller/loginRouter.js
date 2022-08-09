const express = require("express");
const loginRouter = express.Router();

// @desc  Login/Landing page
// @route get /
loginRouter.get("/", (req, res) => {
  res.render("login", { layout: "login" });
});

// @desc  Dashboard
// @route get /dashboard
loginRouter.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

module.exports = loginRouter;
