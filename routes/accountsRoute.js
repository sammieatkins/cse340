// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountsController = require("../controllers/accountController.js")
const utilities = require("../utilities/index.js")

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountsController.buildLogin));

// Route to build single view for inventory item
// router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleView));

module.exports = router;