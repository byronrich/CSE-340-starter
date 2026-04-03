// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

/* ****************************************
 * Public Routes (No Login Required)
 **************************************** */

// Build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Build vehicle detail view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)

// Intentional error trigger
router.get("/error/trigger", (req, res, next) => {
  throw new Error("Intentional server crash")
})

/* ****************************************
 * Protected Routes (Login Required)
 **************************************** */

// Inventory Management View
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.handleErrors(invController.buildManagement)
)

// Deliver Add Classification View
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Add Classification
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Deliver Add Inventory View
router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process Add Inventory
router.post(
  "/add-inventory",
  utilities.checkJWTToken,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
