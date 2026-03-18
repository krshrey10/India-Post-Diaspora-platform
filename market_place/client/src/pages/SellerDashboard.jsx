import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SellerProductForm from '../components/SellerProductForm';

const SellerDashboard = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyProducts = async () => {
      if (!user || user.role !== 'seller') return;
      setLoading(true);
      try {
        // Prefer the authenticated endpoint to fetch current seller products
        const res = await axios.get(`http://localhost:5000/api/auth/my-products`);
        setProducts(Array.isArray(res.data?.products) ? res.data.products : res.data.products || []);
      } catch (error) {
        console.error('Failed to fetch seller products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [user]);

  if (!user || user.role !== 'seller') {
    return (
      <div className="dashboard-container">
        <h1>Seller Dashboard</h1>
        <p>Only sellers can access the Seller Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Seller Dashboard</h1>
      <div className="dashboard-content">
        <p>Welcome {user.name || user.username}! Here are your products:</p>
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <div className="seller-products">
            {products.length === 0 ? (
              <div>No products found. Add some products to your store.</div>
            ) : (
              <ul>
                {products.map((p) => (
                  <li key={p._id} className="seller-product-card">
                    <img src={p.image} alt={p.name} width={80} />
                    <div className="product-info">
                      <div className="product-name">{p.name}</div>
                      <div className="product-price">₹{p.price}</div>
                      <div className="product-category">{p.category}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="seller-add-section">
          <h3>Add Product</h3>
          <SellerProductForm onAdded={(p) => setProducts((old) => [p, ...old])} />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;