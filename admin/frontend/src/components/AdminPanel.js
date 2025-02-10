import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import Dashboard from './Dashboard'; // Import the new Dashboard component
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <Router>
      <div className="admin-panel">
        <aside className="sidebar">
          <h2>Admin Panel</h2>
          <ul>
            <li><NavLink to="/" activeClassName="active">Dashboard</NavLink></li>
            <li><NavLink to="/add-product" activeClassName="active">Add Product</NavLink></li>
            <li><NavLink to="/view-products" activeClassName="active">View Products</NavLink></li>
            <li><NavLink to="/settings" activeClassName="active">Settings</NavLink></li>
          </ul>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} /> {/* Use the Dashboard component */}
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/view-products" element={<ProductList />} />
            <Route path="/settings" element={<h1>Settings</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AdminPanel;
