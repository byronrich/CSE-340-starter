const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/* ****************************************
 *  Account management view (default /account/)
 *  PROTECTED ROUTE — Step 2
 * **************************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

/* ****************************************
 *  Login view
 * **************************************** */
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

/* ****************************************
 *  Process Login (POST)
 * **************************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ****************************************
 *  Logout
 * **************************************** */
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
})

/* ****************************************
 *  Registration view
 * **************************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

/* ****************************************
 *  Process Registration
 * **************************************** */
router.post(
  "/login",
  (req, res, next) => { console.log("HIT: login POST"); next(); },
  regValidate.loginRules(),
  (req, res, next) => { console.log("HIT: loginRules passed"); next(); },
  regValidate.checkLoginData,
  (req, res, next) => { console.log("HIT: checkLoginData passed"); next(); },
  utilities.handleErrors(accountController.accountLogin)
)


module.exports = router
