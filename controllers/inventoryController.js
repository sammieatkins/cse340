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
  // const data = await inventoryModel.getClassifications();
  let classificationDropdown = await utilities.buildClassificationDropdown();

  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
    classificationDropdown,
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
      errors: null,
      classification_name,
    });
  } else {
    req.flash("notice", "Sorry, the classification failed.");
    res.status(501).render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
inventoryController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationId);
  // console.log(`req.params.classificationId: ${req.params.classificationId}`)
  const invData = await inventoryModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inventory_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 * Build "Edit Inventory" View
 * ************************** */
inventoryController.buildEditInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inventoryId = req.params.inventoryId;
  const itemData = await inventoryModel.getInventoryById(inventoryId);
  const itemName = `${itemData.inventory_make} ${itemData.inventory_model}`;
  let dropdown = await utilities.buildClassificationDropdown(
    itemData.classification_id
  );
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    dropdown,
    errors: null,
    inventory_id: itemData.inventory_id,
    inventory_make: itemData.inventory_make,
    inventory_model: itemData.inventory_model,
    inventory_year: itemData.inventory_year,
    inventory_description: itemData.inventory_description,
    inventory_image: itemData.inventory_image,
    inventory_thumbnail: itemData.inventory_thumbnail,
    inventory_price: itemData.inventory_price,
    inventory_miles: itemData.inventory_miles,
    inventory_color: itemData.inventory_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
inventoryController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inventory_make,
    inventory_model,
    inventory_description,
    inventory_image,
    inventory_thumbnail,
    inventory_price,
    inventory_year,
    inventory_miles,
    inventory_color,
    classification_id,
    inventory_id,
  } = req.body;

  const updateResult = await inventoryModel.updateInventory(
    inventory_make,
    inventory_model,
    inventory_description,
    inventory_image,
    inventory_thumbnail,
    inventory_price,
    inventory_year,
    inventory_miles,
    inventory_color,
    classification_id,
    inventory_id
  );

  if (updateResult) {
    const itemName =
      updateResult.inventory_make + " " + updateResult.inventory_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const dropdown = await utilities.buildClassificationDropdown(
      classification_id
    );
    const itemName = `${inventory_make} ${inventory_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      dropdown: dropdown,
      errors: null,
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
      inventory_id,
    });
  }
};

/* ***************************
 * Build "Delete Inventory" View
 * ************************** */
inventoryController.buildDeleteInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inventoryId = req.params.inventoryId;
  const itemData = await inventoryModel.getInventoryById(inventoryId);
  const itemName = `${itemData.inventory_make} ${itemData.inventory_model}`;
  let dropdown = await utilities.buildClassificationDropdown(
    itemData.classification_id
  );
  res.render("inventory/deleteConfirm", {
    title: "Delete " + itemName,
    nav,
    dropdown,
    errors: null,
    inventory_id: itemData.inventory_id,
    inventory_make: itemData.inventory_make,
    inventory_model: itemData.inventory_model,
    inventory_year: itemData.inventory_year,
    inventory_price: itemData.inventory_price,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Delete Inventory
 * ************************** */
inventoryController.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inventory_make, inventory_model, classification_id, inventory_id } =
    req.body;

  const deleteResult = await inventoryModel.deleteInventory(inventory_id);

  if (deleteResult) {
    const itemName = inventory_make + " " + inventory_model;
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    const dropdown = await utilities.buildClassificationDropdown(
      classification_id
    );
    const itemName = `${inventory_make} ${inventory_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/deleteInventory", {
      title: "Delete " + itemName,
      nav,
      dropdown: dropdown,
      errors: null,
      inventory_id,
    });
  }
};

module.exports = inventoryController;
