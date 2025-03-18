import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool;
let query;
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Added for troubleshooting queries
  // during development
  query = async (text, params) => {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export { query };
export default pool;
