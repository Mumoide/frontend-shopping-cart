const { Router } = require('express');
const pool = require('../db')
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const webpayPlus = require('../webpay.js');

// Fetch all products
router.get('/products', async (req, res) => {
    try {
        const { category } = req.params;  // Extracting category from URL parameters
        // SQL query to fetch products by category
        const result = await pool.query('SELECT * FROM products');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Products not found." });
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

// Fetch products by category
router.get('/products/:category', async (req, res) => {
    try {
        const { category } = req.params;  // Extracting category from URL parameters
        // SQL query to fetch products by category
        const result = await pool.query('SELECT * FROM products WHERE category_id = (SELECT category_id FROM categories WHERE name = $1)', [category]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No products found for this category." });
        }
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Create user
router.post('/signup', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // SQL query to insert a new user
        const newUser = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, hashedPassword, firstName, lastName, phone]
        );

        res.status(201).json({
            status: "success",
            data: {
                user: newUser.rows[0],
            },
            message: "User registered successfully."
        });
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // PostgreSQL error code for unique violation
            return res.status(409).json({ message: "El correo ya se encuentra registrado." });
        }
        res.status(500).json({ message: "Server error during user registration." });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare provided password with hashed password in database
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email }, // payload
            process.env.JWT_SECRET, // secret key from environment variables
            { expiresIn: '1h' } // options: token will expire in 1 hour
        );

        // Login successful, return user info and token
        res.json({
            status: "success",
            data: {
                user: {
                    userId: user.user_id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name
                },
                token
            },
            message: "Logged in successfully."
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error during login." });
    }
});

// Create subscriber
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // SQL query to insert a new user
        const newSubscriber = await pool.query(
            'INSERT INTO newsletter_subscribers (email) VALUES ($1) RETURNING *',
            [email]
        );

        res.status(201).json({
            status: "success",
            data: {
                user: newSubscriber.rows[0],
            },
            message: "Subscriber registered successfully."
        })

        if (res.status(201)) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_MAIL,
                    pass: process.env.PASS_MAIL,
                }
            });

            var mailOptions = {
                from: 'ferramasduoc@gmail.com',
                to: email,
                subject: 'Bienvenido a ferramas',
                text: 'Te has suscrito a ferramas correctamente!'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        };
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') { // PostgreSQL error code for unique violation
            return res.status(409).json({ message: "El correo ya se encuentra registrado." });
        }
        res.status(500).json({ message: "Server error during user registration." });
    }
});

// Ruta para iniciar la transacción
router.post('/create_transaction', async (req, res) => {
    try {
        const { buyOrder, sessionId, amount, returnUrl } = req.body;
        const response = await webpayPlus.create(buyOrder, sessionId, amount, returnUrl);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para confirmar la transacción
router.post('/commit_transaction', async (req, res) => {
    try {
        const { token } = req.body;
        const response = await webpayPlus.commit(token);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new cart
router.post('/carts', async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await pool.query(
            'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
            [userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error creating cart." });
    }
});

// Add an item to the cart
router.post('/cart_items', async (req, res) => {
    try {
        const { cartId, productId, quantity } = req.body;
        const result = await pool.query(
            'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [cartId, productId, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error adding item to cart." });
    }
});

// Get a user's cart
router.get('/carts/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching cart for userId:', userId); // Add logging
        const result = await pool.query(
            'SELECT * FROM carts WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No cart found for this user." });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error retrieving cart." });
    }
});

// Get cart items
router.get('/cart_items/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        console.log('Fetching items for cartId:', cartId); // Add logging
        const result = await pool.query(
            'SELECT * FROM cart_items WHERE cart_id = $1',
            [cartId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No items found for this cart." });
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching cart items:', err.message);
        res.status(500).json({ message: "Server error retrieving cart items." });
    }
});




module.exports = router;