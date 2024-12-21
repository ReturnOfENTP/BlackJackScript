require('dotenv').config();

const { Pool } = require('pg');
const pool = new Pool({
    user: 'entprenour',
    host: 'localhost',
    database: 'login',
    password: 'FruityISO100baby',
    port: 5432,
});

// Function to update user balance after deposit
const updateUserBalance = async (userId, amount) => {
  try {
    const result = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance',
      [amount, userId]
    );
    return result.rows[0].balance;
  } catch (err) {
    console.error('Error updating user balance:', err);
    throw err;
  }
};

module.exports = { updateUserBalance };
