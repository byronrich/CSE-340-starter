/******************************************
 * Required Resources
 ******************************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const path = require("path")

// Routes & Controllers
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")

// Utilities (needed for error handling + nav)
const utilities = require("./utilities/")

/******************************************
 * View Engine & Layouts
 ******************************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/******************************************
 * Static Files
 ******************************************/
app.use(express.static(path.join(__dirname, "public")))

/******************************************
 * Routes
 ******************************************/

// Home route (wrapped in error handler)
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes (wrapped in error handler)
app.use("/inv", inventoryRoute)

// Static routes
app.use(staticRoutes)

/******************************************
 * Intentional 500 Error Route
 * (Task 3 requirement)
 ******************************************/
app.get("/error/trigger", (req, res, next) => {
  throw new Error("Intentional server crash")
})

/******************************************
 * File Not Found (404)
 ******************************************/
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry, the page you are looking for does not exist."
  })
})

/******************************************
 * Express Error Handler
 ******************************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at "${req.originalUrl}": ${err.message}`)

  // Use generic message unless it's a 404
  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  })
})

/******************************************
 * Server Activation
 ******************************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
