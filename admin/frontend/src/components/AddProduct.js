import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Package, DollarSign, Tag, Palette, Ruler, FileText, Camera } from 'lucide-react';
import './AddProduct.css';

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
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const imageInputRef = useRef(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (file) => {
    if (file) {
      setUploading(true);
      
      // Replace this with your actual Cloudinary upload logic
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ujkreuzq');

      try {
        // Simulate upload - replace with actual API call
        const imageUrl = URL.createObjectURL(file);
        
        setTimeout(() => {
          setProduct({ ...product, image: imageUrl });
          setImagePreview(imageUrl);
          setUploading(false);
        }, 1500);
        
        // Actual Cloudinary upload (uncomment when ready)
        // const res = await axios.post('https://api.cloudinary.com/v1_1/dbxkrall1/image/upload', formData);
        // const imageUrl = res.data.secure_url;
        // setProduct({ ...product, image: imageUrl });
        // setImagePreview(imageUrl);
      } catch (err) {
        alert('Image upload failed.');
        setUploading(false);
      }
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageChange(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setProduct({ ...product, image: '' });
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Replace with your actual API call
      // await axios.post('http://localhost:5001/products/add', product);
      
      // Simulate API call
      setTimeout(() => {
        alert('Product added successfully!');
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
        if (imageInputRef.current) imageInputRef.current.value = '';
        setSubmitting(false);
      }, 2000);
    } catch (err) {
      alert('Failed to add product.');
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        {/* Header */}
        <div className="header-section">
          
          <p className="form-title">Add New Product</p>
          <p className="header-subtitle">Create and showcase your amazing products</p>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="form-container">
            <div className="form-grid">
              
              {/* Product Title */}
              <div className="form-group full-width">
                <label className="form-label">
                  <Package className="icon-blue" />
                  Product Title
                </label>
                <input
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="form-input"
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="form-label">
                  <DollarSign className="icon-green" />
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  <Tag className="icon-purple" />
                  Category
                </label>
                <select
                  name="categories"
                  value={product.categories}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Category</option>
                  <option value="men">Men's Collection</option>
                  <option value="women">Women's Collection</option>
                </select>
              </div>

              {/* Size */}
              <div className="form-group">
                <label className="form-label">
                  <Ruler className="icon-orange" />
                  Size
                </label>
                <input
                  name="size"
                  value={product.size}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="form-input"
                />
              </div>

              {/* Color */}
              <div className="form-group">
                <label className="form-label">
                  <Palette className="icon-pink" />
                  Color
                </label>
                <input
                  name="color"
                  value={product.color}
                  onChange={handleChange}
                  placeholder="Red, Blue, Green"
                  className="form-input"
                />
              </div>

              {/* Description */}
              <div className="form-group description-field">
                <label className="form-label">
                  <FileText className="icon-indigo" />
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  required
                  className="form-textarea"
                />
              </div>

              {/* Image Upload */}
              <div className="form-group full-width">
                <label className="form-label">
                  <Camera className="icon-emerald" />
                  Product Image
                </label>
                
                {!imagePreview ? (
                  <div
                    className={`image-upload-container ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      ref={imageInputRef}
                      className="image-upload-input"
                    />
                    <div className="upload-content">
                      <div className="upload-icon">
                        <Upload />
                      </div>
                      {uploading ? (
                        <div className="upload-loading">
                          <div className="spinner"></div>
                          <p className="upload-loading-text">Uploading image...</p>
                        </div>
                      ) : (
                        <div>
                          <p className="upload-text">Drop your image here or click to browse</p>
                          <p className="upload-subtext">Supports JPG, PNG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="image-preview-card">
                    <div className="image-preview-content">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                      <div className="image-preview-info">
                        <p className="image-preview-title">Image uploaded successfully!</p>
                        <p className="image-preview-subtitle">Your product image is ready</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="image-remove-btn"
                      >
                        <X />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button
                onClick={handleSubmit}
                disabled={uploading || submitting}
                className="submit-btn"
              >
                {submitting ? (
                  <>
                    <div className="spinner"></div>
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <Plus />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;