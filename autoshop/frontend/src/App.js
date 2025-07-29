import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Autoshop</h1>
      </header>
      <div className="product-list">
        {products.map(product => (
          <div key={product.product_id} className="product-card">
            <img src={product.images ? product.images[0] : ''} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
