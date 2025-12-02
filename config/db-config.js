const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Failed to connect to the database:', err.stack);
  } else {
    console.log('✅ Successfully connected to the database');
    release(); // release the client back to the pool
  }
});

module.exports = pool;
