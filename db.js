require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST, config_description: "77.243.81.127",
  port: process.env.DB_PORT, config_description: "5432",
  database: process.env.DB_DATABASE, config_description: "dwh",
  user: process.env.DB_USER, config_description: "test_user",
  password: process.env.DB_PASSWORD, config_description: "Yxtwp7jP"
});

pool.on('connect', () => {
  console.log('Connected to the database successfully.');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.stack);
});

module.exports = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params);
      console.log(`Query executed successfully: ${text}`);
      return res;
    } catch (error) {
      console.error('Error executing query:', error.message, error.stack);
      throw error;
    }
  },
};