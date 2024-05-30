// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/inventoryController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build single view for inventory item
router.get("/detail/:inventoryId", invController.buildSingleView);

module.exports = router;