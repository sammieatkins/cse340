// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController.js");
const utilities = require("../utilities/index.js");
const registrationValidate = require("../utilities/accountValidation.js");

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegistration)
);

router.post(
  "/account/register",
  utilities.handleErrors(accountController.registerAccount)
);

// Process the registration data
router.post(
  "/account/register",
  registrationValidate.registrationRules(),
  registrationValidate.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to build single view for inventory item
// router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleView));

module.exports = router;
