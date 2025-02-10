import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [expanded, setExpanded] = useState({});
  const [category, setCategory] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Number of products per page

  // Fetch products with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5001/products', {
          params: {
            page: currentPage,
            limit: limit,
          },
        });
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error fetching products.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, limit]);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5001/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting the product.");
    }
  };

  const toggleDescription = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setCurrentProduct({ ...product });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/products/${currentProduct._id}`, currentProduct);
      setProducts((prevProducts) => prevProducts.map((prod) => (prod._id === currentProduct._id ? { ...currentProduct } : prod)));
      alert("Product updated successfully!");
      setIsEditing(false);
      setCurrentProduct({});
    } catch (err) {
      console.error(err);
      alert("Error updating the product.");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-list-page">
      {/* Title */}
      <div className="product-list-title-container">
        <h2 className="product-list-title">Product List</h2>
      </div>

      {/* Products List Container */}
      <div className="product-list-container">
        {isEditing ? (
          <form onSubmit={handleUpdateProduct} className="update-form">
            <h3 className="text-lg font-semibold">Update Product</h3>
            <input
              type="text"
              value={currentProduct.title || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, title: e.target.value })}
              placeholder="Product Title"
              required
              className="mb-2 p-2 border rounded"
            />
            <textarea
              value={currentProduct.description || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
              placeholder="Product Description"
              required
              className="mb-2 p-2 border rounded"
            />
            <input
              type="number"
              value={currentProduct.price || ''}
              onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
              placeholder="Product Price"
              required
              className="mb-2 p-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Update
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2">
              Cancel
            </button>
          </form>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <div key={product._id} className="product-card p-4 bg-white rounded-lg shadow-md">
                <div className="product-image-container">
                  <img src={product.image} alt={product.title} className="product-image" />
                </div>
                <h3 className="text-lg font-semibold mt-4">{product.title}</h3>
                <div className={`product-description ${expanded[product._id] ? 'expanded' : ''}`}>
                  <p>{product.description}</p>
                </div>
                <button onClick={() => toggleDescription(product._id)} className="read-more">
                  {expanded[product._id] ? 'Read Less' : 'Read More'}
                </button>
                <p className="font-bold text-gray-800 mb-4">₹ {product.price}</p>
                <div className="button-group flex space-x-2">
                  <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                    Delete
                  </button>
                  <button onClick={() => handleEditClick(product)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
    </div>
  );
};

export default ProductList;