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
 * Protected Routes (Login + Employee/Admin Required)
 **************************************** */

// Inventory Management View
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
)

// Deliver Add Classification View
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process Add Classification
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Deliver Add Inventory View
router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process Add Inventory
router.post(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory item view
router.get(
  "/edit/:inv_id",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
)

// Delete inventory item view
router.get(
  "/delete/:inv_id",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
)

// Process Update Inventory
router.post(
  "/update",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.updateInventory)
)

// Process Delete Inventory
router.post(
  "/delete",
  utilities.checkJWTToken,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

// Edit inventory item view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Delete inventory item view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

// Process Update Inventory
router.post("/update", utilities.handleErrors(invController.updateInventory))

// ⭐ Process Delete Inventory (required)
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router
