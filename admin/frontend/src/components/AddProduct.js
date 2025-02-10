import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AddProduct.css';  // Import the CSS file

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    image: '',
    price: 0,
    inStock: true,
    categories: '',
    size: '',
    color: ''
  });

  const [imagePreview, setImagePreview] = useState(null);  
  const [uploading, setUploading] = useState(false);  
  const [submitting, setSubmitting] = useState(false);  // State for form submission
  const imageInputRef = useRef(null);  

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ujkreuzq'); 

      try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/dbxkrall1/image/upload', formData);
        const imageUrl = res.data.secure_url;
        setProduct({ ...product, image: imageUrl });
        setImagePreview(imageUrl);
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('Image upload failed. Please try again.');  // Alert user
      } finally {
        setUploading(false);  
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setProduct({ ...product, image: '' });
    if (imageInputRef.current) {
      imageInputRef.current.value = '';  
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);  // Set submitting state to true
    try {
      const res = await axios.post('http://localhost:5001/products/add', product);
      alert('Product added successfully!');
      
      // Reset form
      setProduct({
        title: '',
        description: '',
        image: '',
        price: 0,
        inStock: true,
        categories: '',
        size: '',
        color: ''
      });
      setImagePreview(null);  
      if (imageInputRef.current) {
        imageInputRef.current.value = '';  
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add product. Please try again.');  // Alert user
    } finally {
      setSubmitting(false);  // Reset submitting state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <h2>Add Product</h2>
      <input name="title" placeholder="Title" value={product.title} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={product.price} onChange={handleChange} required min="0" />
      
      <select name="categories" value={product.categories} onChange={handleChange} required>
        <option value="">Select Category</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
      </select>

      <input name="size" placeholder="Size (comma separated)" value={product.size} onChange={handleChange} />
      <input name="color" placeholder="Color (comma separated)" value={product.color} onChange={handleChange} />

      <input type="file" accept="image/*" onChange={handleImageChange} ref={imageInputRef} />
      {uploading ? (
        <p>Uploading image...</p>
      ) : (
        imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button type="button" onClick={handleRemoveImage} className="remove-image-btn">X</button>
          </div>
        )
      )}

      <button type="submit" disabled={uploading || submitting}>Add Product</button>
    </form>
  );
};

export default AddProduct;
