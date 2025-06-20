const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
    port: process.env.PORT, 
    connectionLimit: 790, // Increase the connection limit if necessary
    connectTimeout: 90000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the database');
    connection.release();
});

module.exports = pool;
