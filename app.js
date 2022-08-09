const express = require("express");
const connectDb = require("./config/db");

// load config
require("dotenv").config({ path: "./config/config.env" });
// connectDb
connectDb();

const PORT = process.env.PORT || 3001;
const app = express();

app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
