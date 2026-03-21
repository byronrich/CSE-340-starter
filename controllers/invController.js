const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()

  // SAFETY CHECK — prevents crashes
  if (!data || data.length === 0) {
    return next({
      status: 404,
      message: "No vehicles found for this classification."
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getInventoryByInvId(invId)
  let nav = await utilities.getNav()

  // SAFETY CHECK — prevents crashes
  if (!data || data.length === 0) {
    return next({
      status: 404,
      message: "Vehicle not found."
    })
  }

  const detail = await utilities.buildDetailView(data[0])

  res.render("./inventory/detail", {
    title: `${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    detail
  })
}

module.exports = invCont
