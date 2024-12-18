const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Akimbo Portals Middleware CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Allow requests from 127.0.0.1:5500
    methods: ['GET', 'POST'],
}));

// Set up PostgreSQL client
const client = new Client({
  user: 'entprenour',
  host: 'localhost',
  database: 'login',
  password: 'FruityISO100baby',
  port: 5432,
});
client.connect();

// Login route
app.post('/users/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  console.log('Request Body:', req.body); // Log incoming data

  try {
    // Query the database to get the user data
    const result = await client.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2', [usernameOrEmail, usernameOrEmail]
    );

    if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log('Found User:', user); // Log found user

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          console.log('Password match successful');
          return res.json({
            message: 'Login successful',
            userId: user.id, // Send userId for fetching user data later
            username: user.username, // Retrieved from the "users" table
            wallet: user.wallet,     // Retrieved from the "users" table
          });
        } else {
          return res.status(400).json({ message: 'Incorrect password' });
        }
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
    
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// Register route
app.post('/users/register', async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if the username or email already exists
    const checkExistingUser = await client.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (checkExistingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email or Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await client.query(
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, username, wallet',
      [email, username, hashedPassword]
    );

    // Return a JSON response with the newly created user ID and wallet info
    return res.status(201).json({
      message: 'User registered successfully',
      userId: result.rows[0].id,
      username: result.rows[0].username,
      wallet: result.rows[0].wallet,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Error occurred during registration' });
  }
});

// Get user details (for fetching username and wallet after login)
app.get('/users/details', async (req, res) => {
  const userId = req.query.userId;  // User ID passed from frontend (usually after successful login)

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Query to fetch the user's data from the database
    const result = await client.query('SELECT username, wallet FROM users WHERE id = $1', [userId]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return res.json({
        username: user.username,
        wallet: user.wallet,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ message: 'Error while fetching user details' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
