import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [flaggedOrders, setFlaggedOrders] = useState([]);

  useEffect(() => {
    // Fetch pending products
    fetch('/api/products?status=pending')
      .then(response => response.json())
      .then(data => setPendingProducts(data));

    // Fetch flagged orders
    fetch('/api/orders?review_status=flagged')
      .then(response => response.json())
      .then(data => setFlaggedOrders(data));
  }, []);

  const handleProductApproval = (productId, status) => {
    fetch(`/api/products/${productId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(() => {
      setPendingProducts(pendingProducts.filter(p => p.product_id !== productId));
    });
  };

  const handleOrderReview = (orderId, status) => {
    fetch(`/api/orders/${orderId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(() => {
      setFlaggedOrders(flaggedOrders.filter(o => o.order_id !== orderId));
    });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Pending Products</h2>
      <ul>
        {pendingProducts.map(product => (
          <li key={product.product_id}>
            {product.name}
            <button onClick={() => handleProductApproval(product.product_id, 'approved')}>Approve</button>
            <button onClick={() => handleProductApproval(product.product_id, 'denied')}>Deny</button>
          </li>
        ))}
      </ul>

      <h2>Flagged Orders</h2>
      <ul>
        {flaggedOrders.map(order => (
          <li key={order.order_id}>
            Order #{order.order_id} - Amount: ${order.total_amount}
            <button onClick={() => handleOrderReview(order.order_id, 'approved')}>Approve</button>
            <button onClick={() => handleOrderReview(order.order_id, 'rejected')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
