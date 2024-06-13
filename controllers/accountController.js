const utilities = require("../utilities/index.js");
const accountModel = require("../models/accountModel.js");

const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
accountController.buildRegistration = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/registration", {
    title: "Registration",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res) {
  // console.log(req.body)
  // console.log("in registerAccount")
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.submitAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}


/* ****************************************
 *  Process Login
 * *************************************** */
accountController.loginAccount = async function (req, res) {
  // console.log(req.body)
  // console.log("in loginAccount")
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // const loginResult = await accountModel.loginAccount(
  //   account_email,
  //   account_password
  // );

  if (loginResult) {
    req.flash("notice", `Welcome back ${account_email}.`);
    res.status(200).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the login failed.");
    res.status(501).render("account/login", {
      title: "Login",
      nav,
    });
  }
}

module.exports = accountController;
