const { Pool } = require("pg")
require("dotenv").config()

let pool

// LOCAL DEVELOPMENT — uses SSL ONLY if DATABASE_URL points to Render
if (process.env.NODE_ENV === "development") {
  const isRenderDb = process.env.DATABASE_URL.includes("render.com")

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isRenderDb ? { rejectUnauthorized: false } : false
  })

  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
}

// PRODUCTION ON RENDER — ALWAYS use SSL
else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  module.exports = pool
}
