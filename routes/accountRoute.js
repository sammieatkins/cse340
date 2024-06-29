// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");
const registrationValidate = require("../utilities/accountValidation");

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegistration)
);

// Process the registration data
router.post(
  "/registration",
  registrationValidate.registrationRules(),
  registrationValidate.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  registrationValidate.loginRules(),
  registrationValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
)

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Build account edit view
router.get("/editAccount/:accountId", utilities.handleErrors(accountController.buildEditAccountView))

// Process account edit password
router.get("/editPassword", utilities.handleErrors(accountController.editPassword))

// Process account edit account data
router.get("/editAccount")

module.exports = router;