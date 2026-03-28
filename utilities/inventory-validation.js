const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

/* ****************************************
*  Classification Validation Rules
* *************************************** */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlpha()
      .withMessage("Classification name must contain only letters."),
  ]
}

/* ****************************************
*  Inventory Validation Rules
* *************************************** */
invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a make."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .escape()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Year must be a 4-digit number."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),

    body("inv_price")
      .trim()
      .escape()
      .isFloat()
      .withMessage("Price must be a number."),

    body("inv_miles")
      .trim()
      .escape()
      .isInt()
      .withMessage("Miles must be a whole number."),

    body("inv_color")
      .trim()
      .escape()
      .isAlpha()
      .withMessage("Color must contain only letters."),
  ]
}

/* ****************************************
*  Check Inventory Data
* *************************************** */
invValidate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }
  next()
}

/* ****************************************
*  Check Classification Data
* *************************************** */
invValidate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    })
  }
  next()
}

module.exports = invValidate
