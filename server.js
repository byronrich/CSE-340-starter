/* ******************************************
 * Require Statements
 *******************************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const static = require("./routes/static");

/* ******************************************
 * View Engine and Templates
 *******************************************/
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ******************************************
 * Static Files
 *******************************************/
app.use(express.static("public"));

/* ******************************************
 * Routes
 *******************************************/
app.get("/", (req, res) => {
  res.render("layouts/index");
});

app.use(static);

/* ******************************************
 * Server
 *******************************************/
const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
