import React, { useState } from 'react';

function ProductForm() {
  const [formData, setFormData] = useState({
    productName: '',
    image: null,
    price: '',
    category: '',
    sizes: [],
    colors: [],
  });

  const sizesOptions = ['S', 'M', 'L', 'XL', 'XXL'];
  const colorsOptions = ['White', 'Black', 'Grey', 'Blue', 'Green', 'Red'];

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0], // Save the selected file
    });
  };

  // Handle price input (ensure positive numbers)
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setFormData({
        ...formData,
        price: value,
      });
    }
  };

  // Handle dropdown category selection
  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value,
    });
  };

  // Handle checkbox selections (sizes)
  const handleSizeChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      sizes: prevState.sizes.includes(value)
        ? prevState.sizes.filter((size) => size !== value) // Deselect
        : [...prevState.sizes, value], // Select
    }));
  };

  // Handle checkbox selections (colors)
  const handleColorChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      colors: prevState.colors.includes(value)
        ? prevState.colors.filter((color) => color !== value) // Deselect
        : [...prevState.colors, value], // Select
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Product Data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>

      {/* Product Name */}
      <div>
        <label htmlFor="productName">Product Name:</label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image">Product Image:</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
      </div>

      {/* Price (Only Positive Numbers) */}
      <div>
        <label htmlFor="price">Price ($):</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handlePriceChange}
          min="0"
          required
        />
      </div>

      {/* Category (Dropdown) */}
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
        </select>
      </div>

      {/* Sizes (Checkbox) */}
      <div>
        <label>Sizes:</label>
        {sizesOptions.map((size) => (
          <div key={size}>
            <input
              type="checkbox"
              id={`size-${size}`}
              value={size}
              onChange={handleSizeChange}
            />
            <label htmlFor={`size-${size}`}>{size}</label>
          </div>
        ))}
      </div>

      {/* Colors (Checkbox) */}
      <div>
        <label>Colors:</label>
        {colorsOptions.map((color) => (
          <div key={color}>
            <input
              type="checkbox"
              id={`color-${color}`}
              value={color}
              onChange={handleColorChange}
            />
            <label htmlFor={`color-${color}`}>{color}</label>
          </div>
        ))}
      </div>

      <button type="submit">Submit Product</button>
    </form>
  );
}

export default ProductForm;
