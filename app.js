const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config(); // Load environment variables from .env file
const cloudinary = require("cloudinary").v2;

const indexRouter = require("./routes/index");
const categoryRouter = require("./routes/category");
const itemRouter = require("./routes/item");

const app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
const { item_list } = require("./controllers/itemController");
mongoose.set("strictQuery", false);
const dev_db_url =
  "mongodb+srv://khanhle:VEgvv0PRGjsdww80@cluster0.qer225u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

cloudinary.config({
  cloud_name: "dmqnipwig",
  api_key: process.env.COULDINARY_API_KEY,
  api_secret: process.env.COULDINARY_API_SECRET,
});

app.use("/", indexRouter);
app.use("/category", categoryRouter);
app.use("/item", itemRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
