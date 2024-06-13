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
  utilities.handleErrors((req, res) => {
    res.status(200).render("index", { title: "Home Page", nav: utilities.getNav()});
  }), 
)

// Route to build single view for inventory item
// router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleView));

module.exports = router;
