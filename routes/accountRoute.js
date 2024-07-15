// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");
const accountValidation = require("../utilities/accountValidation");

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
  accountValidation.registrationRules(),
  accountValidation.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  accountValidation.loginRules(),
  accountValidation.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
)

// Process logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Build account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Build account edit view
router.get("/editAccount/:accountId", utilities.handleErrors(accountController.buildEditAccountView))

// Process account edit account data
router.post("/editData", 
  accountValidation.accountRules(),
  utilities.handleErrors(accountController.editAccount))

// Process account edit password
router.post("/editPassword",
  accountValidation.passwordRules(),
  utilities.handleErrors(accountController.editPassword))

// Process review edit
router.post("/editReview",
  accountValidation.reviewRules(),
  utilities.handleErrors(accountController.editReview))

// Process review delete

module.exports = router;