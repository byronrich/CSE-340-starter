/******************************************
 * Environment Variables
 ******************************************/
require("dotenv").config()

console.log("ENV SECRET:", process.env.ACCESS_TOKEN_SECRET)
console.log("WORKING DIRECTORY:", process.cwd())


/******************************************
 * Required Resources
 ******************************************/
const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const utilities = require("./utilities/")

/******************************************
 * Cookie Parser (must come before JWT check)
 ******************************************/
app.use(cookieParser())

/******************************************
 * Sessions & Flash (FIXED)
 ******************************************/
const session = require("express-session")
const pool = require("./database/")
const pgSession = require("connect-pg-simple")(session)

app.use(session({
  store: new pgSession({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,              // FIXED
  saveUninitialized: false,   // FIXED
  name: "sessionId",
  cookie: {
    httpOnly: true,
    secure: false,            // FIXED for localhost
    maxAge: 1000 * 60 * 60    // 1 hour
  }
}))

/******************************************
 * Body Parser Middleware
 ******************************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/******************************************
 * Flash Messages
 ******************************************/
app.use(require("connect-flash")())
app.use(function(req, res, next){
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/******************************************
 * JWT Middleware (must come AFTER flash)
 ******************************************/
app.use(utilities.checkJWTToken)

/******************************************
 * View Engine & Layouts
 ******************************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(expressLayouts)
app.set("layout", "layouts/layout")
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)

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

// Home route (wrapped in error handler)
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// Static routes
app.use(staticRoutes)



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
