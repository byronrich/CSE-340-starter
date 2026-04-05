const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
const Util = {}

/* ************************
 * Build the navigation bar
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  list += '<li><a href="/inv" title="Vehicle Management">Vehicle Management</a></li>'

  data.rows.forEach((row) => {
    list += "<li>"
    list += `<a href="/inv/type/${row.classification_id}" 
              title="See our inventory of ${row.classification_name} vehicles">
              ${row.classification_name}</a>`
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification grid HTML
*************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += `<a href="/inv/detail/${vehicle.inv_id}" 
                title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                <img src="${vehicle.inv_thumbnail}" 
                alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += `<a href="/inv/detail/${vehicle.inv_id}" 
                title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}</a>`
      grid += '</h2>'
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Error Handling Wrapper
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the vehicle detail HTML
*************************************** */
Util.buildDetailView = async function (vehicle) {
  let detail = `
    <section id="vehicle-detail">
      <div class="detail-image">
        <img src="${vehicle.inv_image}" 
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>

      <div class="detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <span class="price">$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>

        <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </section>
  `
  return detail
}

/* **************************************
* Build Classification Dropdown
*************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let list = '<select name="classification_id" id="classification_id" required>'
  list += '<option value="">Choose a Classification</option>'

  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"`

    if (classification_id == row.classification_id) {
      list += " selected"
    }

    list += `>${row.classification_name}</option>`
  })

  list += "</select>"
  return list
}

/* ****************************************
 * JWT Authentication Middleware (FIXED)
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt

  // No token? User is simply not logged in.
  if (!token) {
    res.locals.loggedin = 0
    return next()
  }

  // Try to verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Token invalid — treat user as logged out, but DO NOT redirect
      res.locals.loggedin = 0
      res.clearCookie("jwt")
      return next()
    }

    // Token valid
    res.locals.loggedin = 1
    res.locals.accountData = decoded
    next()
  })
}

/* ****************************************
 *  Check Login (protects restricted pages)
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin === 1) {
    return next()
  }

  req.flash("notice", "Please log in.")
  return res.redirect("/account/login")
}

/* ****************************************
 *  Check Account Type (Employee or Admin)
 * **************************************** */
Util.checkAccountType = function (req, res, next) {
  const accountData = res.locals.accountData

  // Not logged in at all
  if (!accountData) {
    req.flash("notice", "Please log in to access this page.")
    return res.redirect("/account/login")
  }

  // Logged in but not authorized
  if (accountData.account_type !== "Employee" && accountData.account_type !== "Admin") {
    req.flash("notice", "You do not have permission to access this area.")
    return res.redirect("/account/login")
  }

  // Authorized
  next()
}


module.exports = Util
