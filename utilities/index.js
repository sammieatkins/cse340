const inventoryModel = require("../models/inventoryModel");
const accountModel = require("../models/accountModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Utilities = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Utilities.getNav = async function (req, res, next) {
  let data = await inventoryModel.getClassifications();
  // console.log(data)
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Utilities.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inventory_id +
        '" title="View ' +
        vehicle.inventory_make +
        " " +
        vehicle.inventory_model +
        'details"><img src="' +
        vehicle.inventory_thumbnail +
        '" alt="' +
        vehicle.inventory_make +
        " " +
        vehicle.inventory_model +
        '" /></a>';
      grid += '<div class="namePrice">';
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inventory_id +
        '" title="View ' +
        vehicle.inventory_make +
        " " +
        vehicle.inventory_model +
        ' details">' +
        vehicle.inventory_make +
        " " +
        vehicle.inventory_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inventory_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += "Sorry, no matching vehicles could be found.";
  }
  return grid;
};

// Build a custom function in the utilities > index.js file that will take the specific vehicle's information and wrap it up in HTML to deliver to the view
Utilities.buildSingleView = async function (data) {
  let singleView = '<section id="inv-single">';
  singleView +=
    "<h1>" + data.inventory_make + " " + data.inventory_model + "</h1>";
  singleView +=
    '<img src="' +
    data.inventory_image +
    '" alt="' +
    data.inventory_make +
    " " +
    data.inventory_model +
    '" />';
  singleView += '<section id="inv-details">';
  singleView += "<p>" + data.inventory_description + "</p>";
  singleView +=
    '<p><span class="bold">Price:</span> $' +
    new Intl.NumberFormat("en-US").format(data.inventory_price) +
    "</p>";
  singleView +=
    '<p><span class="bold">Color:</span> ' + data.inventory_color + "</p>";
  singleView +=
    '<p><span class="bold">Year:</span> ' + data.inventory_year + "</p>";
  singleView += "</section>";
  singleView += "</section>";
  return singleView;
};

/* ****************************************
 * Build the reviews HTML for the inventory view
 **************************************** */
Utilities.buildInventoryReviews = async function (reviewsData, res) {
  // reviewsData is a list of objects
  let reviews = "<ul class='reviewList'>";
  for (const review of reviewsData) {
    let accountData = await accountModel.getAccountById(review.account_id);
  
    let screenName =
      accountData.account_firstname[0] + " " + accountData.account_lastname;
  
    let formattedDate = review.review_date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    reviews += "<li>";
    reviews += "<h3>" + screenName + " wrote on " + formattedDate + "</h3>";
    reviews += "<p>" + review.review_text + "</p>";
    reviews += "</li>";
  }  
  reviews += "</ul>";
  return reviews;
};

/* ****************************************
 * Build the reviews HTML for the management view
 **************************************** */
Utilities.buildAccountReviews = async function (reviewsData, res) {
  let reviews = "<ul class='reviewList'>";
  reviewsData.forEach((review) => {
    let screenName =
      res.locals.accountData.account_firstname[0] +
      " " +
      res.locals.accountData.account_lastname;
    let formattedDate = review.review_date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    reviews += "<li>";
    reviews += "<h3>" + screenName + " wrote on " + formattedDate + "</h3>";
    reviews += "<p>" + review.review_text + "</p>";

    // only difference *eyeroll* = edit and delete links
    reviews +=
      '<a href="/account/editReview/' + review.review_id + '">| Edit |</a>';
    reviews +=
      '<a href="/account/deleteReview/' + review.review_id + '"> Delete | </a>';

    reviews += "</li>";
  });
  reviews += "</ul>";
  return reviews;
};

/* ****************************************
 * Classification List (for dropdown)
 **************************************** */
Utilities.buildClassificationDropdown = async function (
  classification_id = null
) {
  try {
    let data = await inventoryModel.getClassifications();
    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected ";
      }
      classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Error building classification dropdown:", error);
    throw error;
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Utilities.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Utilities.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Utilities.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Admin and Employee
 * ************************************ */
Utilities.checkAdminEmployee = (req, res, next) => {
  if (res.locals.loggedin) {
    const account_type = res.locals.accountData.account_type;
    if (account_type == "Admin" || account_type == "Employee") {
      // you're good to continue
      next();
    } else {
      req.flash(
        "notice",
        "Your account type does not have access to this page."
      );
      res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Your account type does not have access to this page.");
    res.redirect("/account/login");
  }
};

module.exports = Utilities;
