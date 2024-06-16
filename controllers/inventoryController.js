const inventoryModel = require("../models/inventoryModel");
const utilities = require("../utilities");

const inventoryController = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
inventoryController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await inventoryModel.getInventoryByClassificationId(
    classification_id
  );
  // gets the html
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build single view for inventory item
 * ************************** */
inventoryController.buildSingleView = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const singleData = await inventoryModel.getInventoryById(inventory_id);
  // console.log(singleData)
  let nav = await utilities.getNav();
  let singleView = await utilities.buildSingleView(singleData);
  res.render("./inventory/single", {
    title: singleData.inventory_make + " " + singleData.inventory_model,
    nav,
    singleView,
    errors: null,
  });
};

/* ***************************
 *  Build management view for inventory
 * ************************** */
inventoryController.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Build new classification view
 * ************************** */
inventoryController.buildClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Process new classification
 * ************************** */
inventoryController.processClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classificationResult = await inventoryModel.addClassification(
    classification_name
  );
  if (classificationResult) {
    req.flash("notice", `Classification ${classification_name} added.`);
    res.status(201).render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the classification failed.");
    res.status(501).render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ***************************
 *  Build new inventory view
 * ************************** */
inventoryController.buildInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let dropdown = await utilities.buildClassificationDropdown();
    res.render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      dropdown: dropdown,
      errors: null,
    });
  } catch (error) {
    console.error("Error building inventory view:", error);
    next(error);
  }
};

/* ***************************
 *  Process new inventory
 * ************************** */
inventoryController.processInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  
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
  
  let dropdown = await utilities.buildClassificationDropdown(classification_id);
  
  const inventoryResult = await inventoryModel.addInventory(
    inventory_make,
    inventory_model,
    inventory_year,
    inventory_description,
    inventory_image,
    inventory_thumbnail,
    inventory_price,
    inventory_miles,
    inventory_color,
    classification_id
  );
  if (inventoryResult) {
    req.flash(
      "notice",
      `Inventory ${inventory_make} ${inventory_model} added.`
    );
    res.status(201).render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      dropdown,
    });
  } else {
    req.flash("notice", "Sorry, the inventory failed.");
    res.status(501).render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      dropdown,
    });
  }
};

module.exports = inventoryController;
