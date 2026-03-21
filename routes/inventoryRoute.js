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

module.exports = router
