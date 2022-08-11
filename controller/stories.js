const express = require("express");
const stories = express.Router();
const Story = require("../models/Story");
const { ensureAuth } = require("../middleware/auth");

// @desc  Show Add Page
// @route GET /stories/add
stories.get("/add", ensureAuth, (req, res) => {
  const story = { title: "", status: "public", body: "" };
  res.render("stories/add", { story }); //  stories/add.hbs
});

// @desc  Show All Stories
// @route GET /stories/
stories.get("/", ensureAuth, async (req, res) => {
  const stories = await Story.find({ status: "public" }).populate("user").sort({ createdAt: "desc" }).lean();
  console.log(stories);
  res.render("stories/index", { stories });
});

stories.get("/user/:userId", ensureAuth, async (req, res) => {
  const stories = await Story.find({ user: req.params.userId, status: "public" }).populate("user").lean();
  res.render("stories/index", { stories });
});

stories.get("/:id", ensureAuth, async (req, res) => {
  const story = await Story.findById(req.params.id).populate("user").lean();
  console.log(story);
  // if not exist, goto 404
  res.render("stories/show", { story });
});

stories.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500", { message: error });
  }
});

// edit and put
stories.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id }).lean();
  if (!story) return res.render("error/404", { message: "story not found." });
  if (story.user != req.user.id) return res.render("error/404", { message: "you are not the author of the story." });
  res.render("stories/edit", { story });
});

stories.put("/:id", ensureAuth, async (req, res) => {
  let story = await Story.findById(req.params.id);
  if (!story) return res.render("error/404", { message: `Cannot find story ${id}` });
  if (req.user.id != story.user) return res.render("error/404", { message: "Access denied: User difference." });

  try {
    story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

// delete
stories.delete("/:id", ensureAuth, async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});
module.exports = stories;
