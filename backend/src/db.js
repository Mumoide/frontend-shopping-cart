const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME
})

module.exports = pool;