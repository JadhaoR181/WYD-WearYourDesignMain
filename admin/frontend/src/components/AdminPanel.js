// Updated AdminPanel.js with collapsible sidebar and responsive layout
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FiPlusCircle, FiGrid, FiSettings, FiPackage, FiMenu } from 'react-icons/fi';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import Dashboard from './Dashboard';
import './AdminPanel.css';

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className={`admin-panel ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="logo">{sidebarOpen ? 'Admin Panel' : 'A'}</h2>
            <button className="menu-toggle" onClick={toggleSidebar}>
              <FiMenu />
            </button>
          </div>
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className="nav-link">
                <FiGrid className="nav-icon" />
                {sidebarOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-product" className="nav-link">
                <FiPlusCircle className="nav-icon" />
                {sidebarOpen && <span>Add Product</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/view-products" className="nav-link">
                <FiPackage className="nav-icon" />
                {sidebarOpen && <span>View Products</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className="nav-link">
                <FiSettings className="nav-icon" />
                {sidebarOpen && <span>Settings</span>}
              </NavLink>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
