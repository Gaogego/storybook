const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const connectDb = require("./config/db");

// load config
require("dotenv").config({ path: "./config/config.env" });

// passport config
require("./config/passport")(passport);

// connectDb
connectDb();

const app = express();

// middlewares: morgan && exphbs && passport && session
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.engine(".hbs", engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");
//app.set("views", "/views");

app.use(
  session({
    secret: "keyboard cat or any words :)",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname, "public")));

// router
app.use("/", require("./controller/loginRouter"));
app.use("/auth", require("./controller/authRouter"));
app.use("*", (req, res) => res.send("opps. no this resource."));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
