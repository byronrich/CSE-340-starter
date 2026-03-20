const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const staticRoutes = require("./routes/static");
const path = require("path");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Home route (FIXED)
app.get("/", utilities.handleErrors(baseController.buildHome))


// Inventory routes
app.use("/inv", inventoryRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

// Static router
app.use(staticRoutes);

// Server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
