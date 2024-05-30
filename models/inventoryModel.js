const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    // returns array
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// a function to retrieve the data for a specific vehicle in inventory, based on the inventory id (this should be a single function, not a separate one for each vehicle), which is part of the inventory-model

/* ***************************
 *  Get all inventory items and inventory_name by inventory_id
 * ************************** */
async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS inventory
      WHERE inventory.inventory_id =  $1`,
      // $1 is a placeholder for the first value in the array that follows
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById}