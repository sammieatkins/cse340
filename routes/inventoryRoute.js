// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build single view for inventory item
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleView));

module.exports = router;