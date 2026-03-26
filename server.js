/******************************************
 * Required Resources
 ******************************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const accountRoute = require("./routes/accountRoute")


// Sessions & Flash
const session = require("express-session")
const pool = require("./database/")

/******************************************
 * Sessions & Flash Messages Middleware
 ******************************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Flash messages
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

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
 * Routes & Controllers
 ******************************************/
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")

/******************************************
 * Routes
 ******************************************/

// Home route (wrapped in error handler)
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes (wrapped in error handler)
app.use("/inv", inventoryRoute)

// Static routes
app.use(staticRoutes)

// Account routes
app.use("/account", accountRoute)

/******************************************
 * Intentional 500 Error Route
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
