const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getAccounts(){
  return await pool.query("SELECT * FROM public.account")
}

/* *****************************
*   Register new account
* *************************** */
async function submitAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

// export functions
module.exports = {getAccounts, submitAccount, checkExistingEmail}