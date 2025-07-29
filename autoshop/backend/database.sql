-- Products Table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    images JSON,
    price NUMERIC(10, 2) NOT NULL,
    stock_status VARCHAR(50),
    supplier_id INTEGER,
    trending_score INTEGER,
    approval_status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

-- Suppliers Table
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    reliability_score INTEGER,
    contact_info TEXT
);

-- Orders Table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    tracking_number VARCHAR(255),
    fraud_score INTEGER,
    admin_review_status VARCHAR(20) DEFAULT 'none',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Customers Table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    shipping_address TEXT
);

-- Chat Logs Table
CREATE TABLE chat_logs (
    log_id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    session_id VARCHAR(255),
    messages JSON,
    "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
