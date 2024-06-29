require("dotenv").config();

const utilities = require("../utilities/index.js");
const accountModel = require("../models/accountModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
};

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
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const registrationResult = await accountModel.submitAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (registrationResult) {
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
};

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
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password, account_type } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

accountController.accountLogout = async function (req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}

accountController.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
};

accountController.buildEditAccountView = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("account/editAccount", {
    title: "Edit Account",
    nav,
    errors: null,
  });
};

module.exports = accountController;
