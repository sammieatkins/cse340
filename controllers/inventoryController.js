const invModel = require("../models/inventoryModel")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  // gets the html
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single view for inventory item
 * ************************** */
invCont.buildSingleView = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const singleData = await invModel.getInventoryById(inventory_id)
  console.log(singleData)
  let nav = await utilities.getNav()
  let singleView = await utilities.buildSingleView(singleData)
  res.render("./inventory/single", {
    title: singleData.inventory_make + " " + singleData.inventory_model,
    nav,
    singleView
  })
}

module.exports = invCont