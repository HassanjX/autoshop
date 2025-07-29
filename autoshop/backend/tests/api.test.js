const request = require('supertest');
const server = require('../index');

describe('API Endpoints', () => {
  afterAll(() => {
    server.close();
  });

  it('should fetch a list of products', async () => {
    const res = await request(server).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        description: 'This is a test product.',
        images: [],
        price: 9.99,
        stock_status: 'in_stock',
        supplier_id: 1,
        trending_score: 50,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('product_id');
  });

  it('should fetch a list of customers', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new customer', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({
        name: 'Test Customer',
        email: 'test@example.com',
        shipping_address: '123 Test St',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('customer_id');
  });

  it('should fetch a list of orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customer_id: 1,
        total_amount: 19.99,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('order_id');
  });
});
