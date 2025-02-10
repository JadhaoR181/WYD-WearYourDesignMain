// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Create a CSS file for styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>WearYourDesign Admin</h1>
      <div className="nav-links">
        <Link to="/">Product List</Link>
        <Link to="/add">Add Product</Link>
      </div>
    </nav>
  );
};

export default Navbar;
