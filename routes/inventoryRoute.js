// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)
// Route to build vehicle detail view
router.get("/detail/:invId", invController.buildByInvId)
router.get("/error/trigger", (req, res, next) => {
  throw new Error("Intentional server crash")
})
// Inventory Management View
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)
// Deliver Add Classification View
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Add Classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Deliver Add Inventory View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process Add Inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router

