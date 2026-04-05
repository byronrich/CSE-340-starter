const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

/* ****************************************
 *  Deliver Login View
 * *************************************** */
async function buildLogin(req, res, next) {
  const nav = await utilities.getNav()
  return res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Deliver Registration View
 * *************************************** */
async function buildRegister(req, res, next) {
  const nav = await utilities.getNav()
  return res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", "Registration successful. Please log in.")
      return res.redirect("/account/login")
    } else {
      req.flash("notice", "Registration failed.")
      return res.render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email
      })
    }
  } catch (error) {
    console.error("Registration Error:", error)
    req.flash("notice", "Registration failed due to a server error.")
    return res.redirect("/account/register")
  }
}

/* ****************************************
 *  Process Login + Create JWT (SAFE VERSION)
 * *************************************** */
async function accountLogin(req, res, next) {
  const nav = await utilities.getNav()

  try {
    const { account_email, account_password } = req.body

    console.log("🔍 LOGIN BODY:", req.body)

    // Fetch account
    const account = await accountModel.getAccountByEmail(account_email)
    console.log("🔍 ACCOUNT FROM DB:", account)

    if (!account) {
      console.log("❌ No account found for:", account_email)
      req.flash("notice", "Invalid email or password.")
      return res.status(400).render("account/login", { title: "Login", nav, errors: null })
    }

    // Compare password
    const validPassword = await bcrypt.compare(account_password, account.account_password)
    console.log("🔍 BCRYPT RESULT:", validPassword)

    if (!validPassword) {
      console.log("❌ Password mismatch for:", account_email)
      req.flash("notice", "Invalid email or password.")
      return res.status(400).render("account/login", { title: "Login", nav, errors: null })
    }

    // Create JWT
    const payload = {
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type: account.account_type
    }

    console.log("🔍 JWT PAYLOAD:", payload)

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    console.log("🔍 JWT CREATED")

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    })

    req.flash("notice", `Welcome back, ${account.account_firstname}.`)
    return res.redirect("/account/")

  } catch (error) {
    console.error("💥 LOGIN ERROR:", error)
    req.flash("notice", "A server error occurred during login.")
    return res.status(500).render("account/login", { title: "Login", nav, errors: null })
  }
}

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav()
  return res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: res.locals.accountData || null
  })
}

/* ****************************************
 *  Deliver Update Account View
 * **************************************** */
accountCont.buildUpdateAccount = async function (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  let nav = await utilities.getNav()

  res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  })
}

/* ****************************************
 *  Process Account Information Update
 * **************************************** */
accountCont.updateAccount = async function (req, res, next) {
  let nav = await utilities.getNav()

  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    const updatedAccount = await accountModel.getAccountById(account_id)

    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccount
    })
  } else {
    req.flash("notice", "Update failed.")
    const accountData = await accountModel.getAccountById(account_id)

    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData
    })
  }
}

/* ****************************************
 *  Process Password Change
 * **************************************** */
accountCont.updatePassword = async function (req, res, next) {
  let nav = await utilities.getNav()

  const { account_id, account_password } = req.body

  // Hash the new password
  const hashedPassword = await bcrypt.hash(account_password, 10)

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    const updatedAccount = await accountModel.getAccountById(account_id)

    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccount
    })
  } else {
    req.flash("notice", "Password update failed.")
    const accountData = await accountModel.getAccountById(account_id)

    return res.render("account/update-account", {
      title: "Update Account Information",
      nav,
      errors: null,
      accountData
    })
  }
}

/* ****************************************
 *  Logout Process
 * **************************************** */
accountCont.logout = async function (req, res, next) {
  res.clearCookie("jwt")  // delete the token cookie
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement
}
