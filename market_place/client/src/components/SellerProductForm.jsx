import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function SellerProductForm({ onAdded }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', price: 0, category: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, seller: user.businessDetails?.businessName || user.username };
      const res = await axios.post('http://localhost:5000/api/products', payload);
      onAdded && onAdded(res.data);
      setForm({ name: '', description: '', price: 0, category: '', image: '' });
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message;
      setError(errMsg);
      if (err?.response?.status === 401) {
        // Prompt user to re-login
        setError('Session expired or invalid. Please log in again to add products.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="seller-add-product">
      {error && <div className="error-message">{error}</div>}
      <input name="name" placeholder="Product name" value={form.name} onChange={onChange} required />
      <input name="price" placeholder="Price" type="number" value={form.price} onChange={onChange} required />
      <input name="category" placeholder="Category" value={form.category} onChange={onChange} />
      <input name="image" placeholder="Image URL" value={form.image} onChange={onChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={onChange}></textarea>
      <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
    </form>
  );
}
