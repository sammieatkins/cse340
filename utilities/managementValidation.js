const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/* ******************************
 * Classification Rules
 * ***************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .isAlphanumeric()
      .withMessage(
        "Please provide a classification name that meets the requirements."
      ),
  ];
};

/* ******************************
 * Check classification name
 * ***************************** */
validate.checkClassificationName = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  let nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    console.log(errors);
    res.render("inventory/addClassification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* ******************************
 * Inventory Rules
 * ***************************** */
validate.inventoryRules = () => {
  return [
    body("inventory_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .isAlphanumeric()
      .withMessage("Please provide a make that meets the requirements."),
    body("inventory_model")
      .trim()
      .escape()
      .notEmpty()
      // .withMessage("Empty field.")
      .isLength({ min: 2 })
      .isAlphanumeric()
      .withMessage("Please provide a model that meets the requirements."),
    body("inventory_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .isNumeric()
      .withMessage("Please provide a year that meets the requirements."),
    body("inventory_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a make that meets the requirements."),
    body("inventory_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
    //   .isURL()
      .withMessage("Please provide an image that meets the requirements."),
    body("inventory_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
    //   .isURL()
      .withMessage("Please provide a thumbnail that meets the requirements."),
    body("inventory_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a price that meets the requirements."),
    body("inventory_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide miles that meet the requirements."),
    body("inventory_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .isAlphanumeric()
      .withMessage("Please provide a color that meet the requirements."),
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage(
        "Please provide a classification id that meets the requirements."
      ),
  ];
};

/* ******************************
 * Check inventory inputs
 * ***************************** */
validate.checkInventory = async (req, res, next) => {
  const {
    inventory_make,
    inventory_model,
    inventory_year,
    inventory_description,
    inventory_image,
    inventory_thumbnail,
    inventory_price,
    inventory_miles,
    inventory_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  let dropdown = await utilities.buildClassificationDropdown(classification_id);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addInventory", {
      errors,
      title: "Add Inventory",
      nav,
      dropdown,
      inventory_make,
      inventory_model,
      inventory_year,
      inventory_description,
      inventory_image,
      inventory_thumbnail,
      inventory_price,
      inventory_miles,
      inventory_color,
      classification_id,
    });
    return;
  }
  next();
};

module.exports = validate;
