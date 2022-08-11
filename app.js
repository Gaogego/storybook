const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const methodOverride = require("method-override");
const connectDb = require("./config/db");

// load config
require("dotenv").config({ path: "./config/config.env" });

// mongoose: connectDb
connectDb();

const app = express();

// form: req.body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// handlebars
const { formatDate, truncate, stripTags, editIcon, select } = require("./helper/hbs");
const helper = { formatDate, truncate, stripTags, editIcon, select };
app.engine(".hbs", engine({ helpers: helper, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// express-session: must advance passport
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
app.use(
  session({
    secret: "keyboard cat or any words :)",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, mongooseConnection: mongoose.connection }),
  })
);

// passport config
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname, "public")));

// global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// router
app.use("/", require("./controller/index"));
app.use("/auth", require("./controller/authRouter"));
app.use("/stories", require("./controller/stories"));
app.use("*", (req, res) => res.send("opps. no this resource."));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
