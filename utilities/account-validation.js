const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check Registration Data
 ****************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),   // <-- FIXED: pass array, not whole object
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/*  **********************************
 *  Login Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* ******************************
 * Check Login Data
 ****************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),   // <-- FIXED HERE TOO
    })
  }
  next()
}

/* ****************************************
 *  Rules for updating account info
 * **************************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (email, { req }) => {
        const account_id = req.body.account_id
        const existingEmail = await accountModel.checkExistingEmail(email)

        // If email exists but belongs to a different account → error
        if (existingEmail && existingEmail.account_id != account_id) {
          throw new Error("Email already exists. Choose another.")
        }
      })
  ]
}

/* ****************************************
 *  Check update account data
 * **************************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(req.body.account_id)

    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: errors.array(),
      accountData
    })
  }
  next()
}

/* ****************************************
 *  Rules for updating password
 * **************************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword()
      .withMessage("Password does not meet requirements.")
  ]
}

/* ****************************************
 *  Check update password data
 * **************************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(req.body.account_id)

    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: errors.array(),
      accountData
    })
  }
  next()
}

module.exports = validate
