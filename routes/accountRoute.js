const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")

/* ****************************************
 *  Account Management View (Protected)
 * **************************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

/* ****************************************
 *  Login View
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
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ****************************************
 *  Registration View
 * **************************************** */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

/* ****************************************
 *  Process Registration
 * **************************************** */
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ****************************************
 *  Deliver Update Account View
 * **************************************** */
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

/* ****************************************
 *  Process Account Information Update
 * **************************************** */
router.post(
  "/update",
  utilities.checkJWTToken,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

/* ****************************************
 *  Process Password Change
 * **************************************** */
router.post(
  "/update-password",
  utilities.checkJWTToken,
  accountValidate.updatePasswordRules(),
  accountValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

/* ****************************************
 *  Logout Route
 * **************************************** */
router.get(
  "/logout",
  utilities.handleErrors(accountController.logout)
)

module.exports = router
