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

/* ****************************************
 *  Get account by ID
 * **************************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type
       FROM account
       WHERE account_id = $1`,
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

/* ****************************************
 *  Update account information
 * **************************************** */
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const result = await pool.query(
      `UPDATE account
       SET account_firstname = $1,
           account_lastname = $2,
           account_email = $3
       WHERE account_id = $4
       RETURNING *`,
      [firstname, lastname, email, account_id]
    )
    return result.rowCount
  } catch (error) {
    throw error
  }
}

/* ****************************************
 *  Update password
 * **************************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const result = await pool.query(
      `UPDATE account
       SET account_password = $1
       WHERE account_id = $2
       RETURNING *`,
      [hashedPassword, account_id]
    )
    return result.rowCount
  } catch (error) {
    throw error
  }
}

/* ****************************************
 *  Check if email exists (for validation)
 * **************************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = `SELECT account_id, account_email FROM account WHERE account_email = $1`
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

/* ****************************************
 *  EXPORTS
 * **************************************** */
module.exports = {
  registerAccount,
  getAccountByEmail,
  checkExistingEmail,
  getAccountById,
  updateAccount,
  updatePassword
}
