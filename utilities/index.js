const inventoryModel = require("../models/inventoryModel")
const Utilities = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Utilities.getNav = async function (req, res, next) {
  let data = await inventoryModel.getClassifications()
  // console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Utilities.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inventory_id 
      + '" title="View ' + vehicle.inventory_make + ' '+ vehicle.inventory_model 
      + 'details"><img src="' + vehicle.inventory_thumbnail 
      +'" alt="'+ vehicle.inventory_make + ' ' + vehicle.inventory_model 
      +'" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inventory_id +'" title="View ' 
      + vehicle.inventory_make + ' ' + vehicle.inventory_model + ' details">' 
      + vehicle.inventory_make + ' ' + vehicle.inventory_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inventory_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += 'Sorry, no matching vehicles could be found.'
  }
  return grid
}

// Build a custom function in the utilities > index.js file that will take the specific vehicle's information and wrap it up in HTML to deliver to the view
Utilities.buildSingleView = async function(data){
  let singleView = '<section id="inv-single">'
  singleView += '<h1>' + data.inventory_make + ' ' + data.inventory_model + '</h1>'
  singleView += '<img src="' + data.inventory_image + '" alt="' + data.inventory_make + ' ' + data.inventory_model + '" />'
    singleView += '<section id="inv-details">'
      singleView += '<p>' + data.inventory_description + '</p>'
      singleView += '<p><span class="bold">Price:</span> $' + new Intl.NumberFormat('en-US').format(data.inventory_price) + '</p>'
      singleView += '<p><span class="bold">Color:</span> ' + data.inventory_color + '</p>'
      singleView += '<p><span class="bold">Year:</span> ' + data.inventory_year + '</p>'
    singleView += '</section>'
  singleView += '</section>'
  return singleView
}

/* ****************************************
 * Classification List (for dropdown)
 **************************************** */
Utilities.buildClassificationDropdown = async function (classification_id = null) {
  try {
    let data = await inventoryModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (classification_id != null && row.classification_id == classification_id) {
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
Utilities.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Utilities