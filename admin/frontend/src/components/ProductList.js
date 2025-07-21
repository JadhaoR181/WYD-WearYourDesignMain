import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [expanded, setExpanded] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Available categories for filter
  const [availableCategories, setAvailableCategories] = useState(['All']);

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5001/products', {
          params: {
            page: currentPage,
            limit,
            search: searchTerm.trim() || undefined,
            category: category !== 'All' ? category : undefined,
          },
        });

        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);

        if (res.data.categories && Array.isArray(res.data.categories)) {
          setAvailableCategories(['All', ...res.data.categories]);
        } else {
          const cats = Array.from(new Set(res.data.products.map(p => p.category))).filter(Boolean);
          setAvailableCategories(['All', ...cats]);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching products.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, 400); // debounce delay

  return () => clearTimeout(delayDebounce);
}, [currentPage, limit, searchTerm, category]);


  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5001/products/${id}`);
      setProducts(prev => prev.filter(product => product._id !== id));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error deleting the product.');
    }
  };

  const toggleDescription = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProduct({ ...product });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/products/${currentProduct._id}`, currentProduct);
      setProducts(prev =>
        prev.map(prod => (prod._id === currentProduct._id ? { ...currentProduct } : prod))
      );
      alert('Product updated successfully!');
      setIsEditing(false);
      setCurrentProduct({});
    } catch (err) {
      console.error(err);
      alert('Error updating the product.');
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


  if (loading) return <p className="loading-text">Loading products...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="product-list-page">
      {/* Title */}
      <div className="product-list-title-container">
        <h2 className="product-list-title">Product List</h2>
      </div>

      {/* Search and Filter */}
    <div className="search-container">
    <div className="search-top-row">
    <div className="search-filter-item">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>

    <button className="search-filter-button">
      <FaFilter />
      <span>Filter</span>
    </button>
  </div>

  {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
          aria-label="Previous Page"
        >
          &laquo; Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
          aria-label="Next Page"
        >
          Next &raquo;
        </button>
      </div>
</div>



      {/* Products or Edit Form */}
      <div className="product-list-container">
        {isEditing ? (
          <form onSubmit={handleUpdateProduct} className="update-form">
            <h3 className="update-form-title">Update Product</h3>
            <input
              type="text"
              value={currentProduct.title || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, title: e.target.value })}
              placeholder="Product Title"
              required
              className="update-input"
            />
            <textarea
              value={currentProduct.description || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })}
              placeholder="Product Description"
              required
              className="update-textarea"
            />
            <input
              type="number"
              value={currentProduct.price || ''}
              onChange={e =>
                setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })
              }
              placeholder="Product Price"
              required
              min="0"
              step="0.01"
              className="update-input"
            />
            <div className="button-group update-buttons">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.title} className="product-image" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4 product-title">{product.title}</h3>
                  <div className={`product-description ${expanded[product._id] ? 'expanded' : ''}`}>
                    <p>{product.description}</p>
                  </div>
                  <button onClick={() => toggleDescription(product._id)} className="read-more">
                    {expanded[product._id] ? 'Read Less' : 'Read More'}
                  </button>
                  <p className="font-bold text-gray-800 mb-4 product-price">
                    ₹ {product.price.toFixed(2)}
                  </p>
                  <div className="button-group flex space-x-2">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No products found.</p>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default ProductList;
