const pool = require('../src/db');

module.exports = async () => {
    await pool.end();
    console.log('Tearing down tests...');
};
