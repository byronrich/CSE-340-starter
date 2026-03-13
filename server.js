/* ******************************************
 * Require Statements
 *******************************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const staticRoutes = require("./routes/static");
const path = require("path");

/* ******************************************
 * View Engine and Templates
 *******************************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ******************************************
 * Static Files
 *******************************************/
app.use(express.static(path.join(__dirname, "public")));

/* ******************************************
 * Routes
 *******************************************/
app.get("/", (req, res) => {
  res.render("layouts/index");
});

app.use(staticRoutes);

/* ******************************************
 * Server
 *******************************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
