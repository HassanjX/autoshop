const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'autoshop',
  password: 'your_db_password',
  port: 5432,
});

app.use(express.json());

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, images, price, stock_status, supplier_id, trending_score } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, images, price, stock_status, supplier_id, trending_score) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, images, price, stock_status, supplier_id, trending_score]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Customer Routes
app.get('/api/customers', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM customers');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/customers', async (req, res) => {
    try {
      const { name, email, shipping_address } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO customers (name, email, shipping_address) VALUES ($1, $2, $3) RETURNING *',
        [name, email, shipping_address]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// Order Routes

app.get('/api/orders', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM orders');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { customer_id, total_amount } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO orders (customer_id, total_amount) VALUES ($1, $2) RETURNING *',
        [customer_id, total_amount]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = server;

app.delete('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM products WHERE product_id = $1', [id]);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// AI Product Sourcing
app.put('/api/products/:id/approve', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await pool.query('UPDATE products SET approval_status = $1 WHERE product_id = $2', [status, id]);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/orders/:id/review', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await pool.query('UPDATE orders SET admin_review_status = $1 WHERE order_id = $2', [status, id]);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

async function sourceTrendingProducts() {
  // In a real application, you would make an API call to a product sourcing service
  // For this example, we'll simulate finding a new product
  const newProduct = {
    name: 'AI-Generated T-Shirt',
    description: 'A unique t-shirt designed by an AI.',
    images: ['/images/ai-tshirt.jpg'],
    price: 29.99,
    stock_status: 'in_stock',
    supplier_id: 1,
    trending_score: 95,
  };

  try {
    await pool.query(
      'INSERT INTO products (name, description, images, price, stock_status, supplier_id, trending_score) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [newProduct.name, newProduct.description, newProduct.images, newProduct.price, newProduct.stock_status, newProduct.supplier_id, newProduct.trending_score]
    );
    console.log('New trending product sourced:', newProduct.name);
  } catch (err) {
    console.error('Error sourcing product:', err);
  }
}

// Periodically source new products (e.g., every 24 hours)
setInterval(sourceTrendingProducts, 24 * 60 * 60 * 1000);
