// Import necessary packages
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const cors = require('cors');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

// Initialize Express app and PostgreSQL client
const loginApp = express();

// Setup middleware for the app
function setupMiddleware(app, origin) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors({
        origin: origin,
        methods: ['GET', 'POST'],
    }));
}

// Set up PostgreSQL client
const client = new Client({
    user: process.env.DB_USER || 'entprenour',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'login',
    password: process.env.DB_PASSWORD || 'FruityISO100baby',
    port: process.env.DB_PORT || 5432,
});

client.connect().then(() => {
    console.log('Connected to PostgreSQL');
}).catch(err => {
    console.error('Error connecting to PostgreSQL:', err);
});

// Middleware configuration
setupMiddleware(loginApp, 'http://127.0.0.1:5500');

// Login route
loginApp.post('/users/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    console.log('Login Request Received:', req.body);

    try {
        const query = 'SELECT * FROM users WHERE email = $1 OR username = $2';
        const result = await client.query(query, [usernameOrEmail, usernameOrEmail]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('User Found:', user);

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                console.log('Password Match Successful');
                return res.json({
                    message: 'Login successful',
                    userId: user.id,
                    username: user.username,
                    wallet: user.wallet,
                });
            } else {
                console.log('Incorrect Password');
                return res.status(400).json({ message: 'Incorrect password' });
            }
        } else {
            console.log('User Not Found');
            return res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error During Login:', error);
        return res.status(500).json({ message: 'Server error during login' });
    }
});

// Register route
loginApp.post('/users/register', async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const checkQuery = 'SELECT * FROM users WHERE email = $1 OR username = $2';
        const checkExistingUser = await client.query(checkQuery, [email, username]);

        if (checkExistingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email or Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, username, wallet';
        const result = await client.query(insertQuery, [email, username, hashedPassword]);

        console.log('User Registered:', result.rows[0]);

        return res.status(201).json({
            message: 'User registered successfully',
            userId: result.rows[0].id,
            username: result.rows[0].username,
            wallet: result.rows[0].wallet,
        });
    } catch (error) {
        console.error('Error During Registration:', error);
        return res.status(500).json({ message: 'Server error during registration' });
    }
});

// Start the Express server
const LOGIN_PORT = 5000;
loginApp.listen(LOGIN_PORT, () => {
    console.log(`Login server running on port ${LOGIN_PORT}`);
});

// Setup WebSocket server for chat functionality
const wss = new WebSocketServer({ port: 8080 }); // WebSocket server running on port 8080
const chatMessages = []; // Store chat messages in an array

wss.on('connection', (ws) => {
    console.log('A user connected');
    
    // Send previous chat messages when a new user connects
    ws.send(JSON.stringify(chatMessages));

    // Broadcast incoming messages to all clients
    ws.on('message', (message) => {
        try {
            const msgObj = JSON.parse(message);
            chatMessages.push(msgObj); // Store message

            // Broadcast message to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(msgObj)); // Send message to all clients
                }
            });
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });

    // Handle user disconnection
    ws.on('close', () => {
        console.log('A user disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
