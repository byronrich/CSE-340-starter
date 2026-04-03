const pool = require("../database/")

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql =
      `INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
       VALUES ($1, $2, $3, $4, 'Client') 
       RETURNING *`

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])

    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error)
    throw error
  }
}

/* *****************************
 *   Get account by email
 * *************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `SELECT * FROM account WHERE account_email = $1`
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    throw error
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail
}
