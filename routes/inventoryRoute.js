// Needed Resources
const express = require("express");
const router = new express.Router();
const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const managementValidate = require("../utilities/managementValidation");
const accountValidation = require("../utilities/accountValidation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(inventoryController.buildByClassificationId)
);

// Route to build single view for inventory item
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(inventoryController.buildSingleView)
);

// Route for adding a review
router.post(
  "/review/:inventoryId",
  accountValidation.reviewRules(),
  accountValidation.checkNewReview,
  utilities.handleErrors(inventoryController.addReview)
);

// router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryByClassificationId));

// Route to build management view for inventory
router.get(
  "/",
  utilities.checkAdminEmployee,
  utilities.handleErrors(inventoryController.buildManagementView)
);
router.get(
  "/getInventory/:classificationId",
  utilities.handleErrors(inventoryController.getInventoryJSON)
);

// Route for editing inventory
// Add a controller-based function to handle the incoming "get" request.
router.get(
  "/edit/:inventoryId",
  utilities.handleErrors(inventoryController.buildEditInventoryView)
);

// Route for new classification
router.get(
  "/addClassification",
  utilities.checkAdminEmployee,
  utilities.handleErrors(inventoryController.buildClassificationView)
);

// Route to process new classification
router.post(
  "/addClassification",
  managementValidate.classificationRules(),
  managementValidate.checkClassificationName,
  utilities.handleErrors(inventoryController.processClassification)
);

// Route for new inventory
router.get(
  "/addInventory",
  utilities.checkAdminEmployee,
  utilities.handleErrors(inventoryController.buildInventoryView)
);

// Route to process new inventory
router.post(
  "/addInventory",
  managementValidate.inventoryRules(),
  managementValidate.checkInventory,
  utilities.handleErrors(inventoryController.processInventory)
);

// Route for editing inventory
router.get(
  "/edit/:inventoryId",
  utilities.checkAdminEmployee,
  utilities.handleErrors(inventoryController.buildEditInventoryView)
);

// Route to process updated inventory
router.post(
  "/update/",
  managementValidate.inventoryRules(),
  managementValidate.checkUpdateData,
  utilities.handleErrors(inventoryController.updateInventory)
);

// Route for getting the delete inventory view
router.get(
  "/delete/:inventoryId",
  utilities.checkAdminEmployee,
  utilities.handleErrors(inventoryController.buildDeleteInventoryView)
);

// Route to process the delete inventory
router.post(
  "/delete/",
  utilities.handleErrors(inventoryController.deleteInventory)
);

module.exports = router;
