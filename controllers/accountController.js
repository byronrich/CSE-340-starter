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
      req.flash("success", "Registration successful. Please log in.")
      return res.redirect("/account/login")
    } else {
      req.flash("error", "Registration failed.")
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
    req.flash("error", "Registration failed due to a server error.")
    return res.redirect("/account/register")
  }
}

/* ****************************************
 *  Process Login + Create JWT
 * *************************************** */
async function accountLogin(req, res, next) {
  const nav = await utilities.getNav()

  try {
    const { account_email, account_password } = req.body

    const account = await accountModel.getAccountByEmail(account_email)

    if (!account) {
      req.flash("error", "Invalid email or password.")
      return res.status(400).render("account/login", { title: "Login", nav, errors: null })
    }

    const validPassword = await bcrypt.compare(account_password, account.account_password)

    if (!validPassword) {
      req.flash("error", "Invalid email or password.")
      return res.status(400).render("account/login", { title: "Login", nav, errors: null })
    }

    const payload = {
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type: account.account_type
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    })

    req.flash("success", `Welcome back, ${account.account_firstname}.`)
    return res.redirect("/account/")

  } catch (error) {
    console.error("LOGIN ERROR:", error)
    req.flash("error", "A server error occurred during login.")
    return res.status(500).render("account/login", { title: "Login", nav, errors: null })
  }
}

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id

  // ⭐ Load favorites for quick list
  const favorites = await accountModel.getFavoritesByAccount(account_id)

  return res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: res.locals.accountData,
    favorites
  })
}

/* ****************************************
 *  Deliver Update Account View
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  const nav = await utilities.getNav()

  return res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData
  })
}

/* ****************************************
 *  Process Account Information Update
 * *************************************** */
async function updateAccount(req, res, next) {
  const nav = await utilities.getNav()

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
    req.flash("success", "Account information updated successfully.")
    const updatedAccount = await accountModel.getAccountById(account_id)

    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccount
    })
  } else {
    req.flash("error", "Update failed.")
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
 * *************************************** */
async function updatePassword(req, res, next) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (updateResult) {
    req.flash("success", "Password updated successfully.")
    const updatedAccount = await accountModel.getAccountById(account_id)

    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccount
    })
  } else {
    req.flash("error", "Password update failed.")
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
 * *************************************** */
async function logout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("success", "You have been logged out.")
  return res.redirect("/")
}

/* ****************************************
 *  Build Favorites View
 * **************************************** */
async function buildFavoritesView(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id

    const favorites = await accountModel.getFavoritesByAccount(account_id)

    return res.render("account/favorites", {
      title: "My Favorites",
      nav,
      errors: null,
      favorites
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Add Favorite
 * **************************************** */
async function addFavorite(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    const exists = await accountModel.checkFavorite(account_id, inv_id)

    if (!exists) {
      await accountModel.addFavorite(account_id, inv_id)
      req.flash("success", "Vehicle added to favorites.")
    } else {
      req.flash("error", "This vehicle is already in your favorites.")
    }

    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  Remove Favorite
 * **************************************** */
async function removeFavorite(req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const { inv_id } = req.body

    await accountModel.removeFavorite(account_id, inv_id)

    req.flash("success", "Vehicle removed from favorites.")
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 *  EXPORTS
 * *************************************** */
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
  logout,
  buildFavoritesView,
  addFavorite,
  removeFavorite
}
