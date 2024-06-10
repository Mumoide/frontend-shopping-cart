const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    // ssl: {
    //     rejectUnauthorized: false, // Required for most cloud database services
    // },
});

(async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Connection to DB worked");
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
    }
})();

module.exports = pool;