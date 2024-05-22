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
    console.log(process.env.USER);
    await pool.query("SELECT NOW()");
    console.log("Conection to DB worked");
})();

module.exports = pool;