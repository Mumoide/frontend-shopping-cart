const { Router } = require('express');
const pool = require('../db')
const router = Router();


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

router.get('/product/id', (req, res) => {
    res.send('Devolviendo un producto');
})

router.post('/createUser', (req, res) => {
    res.send('creando X');
})

router.put('/updateX', (req, res) => {
    res.send('actualizando X');
})


router.delete('/deleteX', (req, res) => {
    res.send('borrando X');
})




module.exports = router;