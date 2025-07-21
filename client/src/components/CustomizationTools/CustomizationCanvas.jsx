import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import "../../assets/css/CustomizationCanvas.css";
import { CartContext, UserContext } from '@/App'
import api from "@/api"

const CustomizationCanvas = () => {

    const {user} = useContext(UserContext)
        const { cartDispatch} = useContext(CartContext)
        const navigate = useNavigate()

    const [isFrontView, setIsFrontView] = useState(true);
    const [selectedImage, setSelectedImage] = useState("/images/crew_front.png");
    const [selectedColor, setSelectedColor] = useState("#ffffff");
    const [previewImageFront, setPreviewImageFront] = useState(null);
    const [previewImageBack, setPreviewImageBack] = useState(null);
    const [uploadedImageFront, setUploadedImageFront] = useState(null);
    const [uploadedImageBack, setUploadedImageBack] = useState(null);
    const [cart, setCart] = useState([]);
    const [imagePositionFront, setImagePositionFront] = useState({ x: 0, y: 0, width: 150, height: 150, rotation: 0 });
    const [imagePositionBack, setImagePositionBack] = useState({ x: 0, y: 0, width: 150, height: 150, rotation: 0 });
    const [showModal, setShowModal] = useState(false);
    const [finalImage, setFinalImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(""); // Track selected size
    const [quantity, setQuantity] = useState(1); // Track quantity
    const [validationError, setValidationError] = useState("");
    const fileInputRefFront = useRef(null);
    const fileInputRefBack = useRef(null);
    const previewRef = useRef(null);  // Reference for the final preview container

    const canvasRef = useRef(null);



    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [basePrice] = useState(200);
const [colorPrice] = useState(50);
const [printPrice] = useState(100);

// Function to calculate total price
const calculateTotalPrice = () => {
    let total = basePrice;
    
    // Add color price
    if (selectedColor !== "#ffffff") {
        total += colorPrice;
    }
    
    // Add size price
    if (selectedSize === "XL") {
        total += 30;
    } else if (selectedSize === "XXL") {
        total += 50;
    }
    
    // Add print prices
    if (uploadedImageFront) total += printPrice;
    if (uploadedImageBack) total += printPrice;
    
    return total * quantity;
};


    const handleTshirtChange = (e) => {
        setSelectedImage(e.target.value);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    const handleSizeChange = (size) => {
        console.log(`Selected Size: ${size}`);
        setSelectedSize(size);
    };

    const SuccessAlert = ({ message }) => {
        return (
            <div className="success-alert">
                <span>✓ {message}</span>
            </div>
        );
    };

    const calculateImagePosition = (position, containerSize) => {
        return {
            x: (containerSize.width - position.width) / 2 + position.x,
            y: (containerSize.height - position.height) / 2 + position.y,
            width: position.width,
            height: position.height,
            rotation: position.rotation
        };
    };
    
    
    const handleImageUpload = (event, isFront) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (isFront) {
                    setPreviewImageFront(e.target.result);
                } else {
                    setPreviewImageBack(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApplyImage = (isFront) => {
        if (isFront) {
            setUploadedImageFront(previewImageFront);
            setPreviewImageFront(null);
        } else {
            setUploadedImageBack(previewImageBack);
            setPreviewImageBack(null);
        }
    };

    const handleRemoveImage = (isFront) => {
        if (isFront) {
            setUploadedImageFront(null);
        } else {
            setUploadedImageBack(null);
        }
        if (isFront && fileInputRefFront.current) {
            fileInputRefFront.current.value = "";
        } else if (!isFront && fileInputRefBack.current) {
            fileInputRefBack.current.value = "";
        }
    };

    const toggleView = () => {
        setIsFrontView((prev) => !prev);
    };

    const tshirtImage = isFrontView
        ? selectedImage
        : selectedImage.replace("_front", "_back");

    const handleAddToBag = () => {
        // Validation for required fields
        if (!selectedSize) {
            setValidationError("Please select a T-shirt size.");
            return; // Stop if size is not selected
        }
        if (quantity <= 0) {
            setValidationError("Quantity must be greater than 0.");
            return; // Stop if quantity is invalid
        }
        if (!uploadedImageFront && !uploadedImageBack) {
            setValidationError("Please upload at least one image (front or back).");
            return; // Stop if no image is uploaded
        }

        // If validation passes, reset error and show modal
        setValidationError(""); // Clear any previous error
        const newItem = {
            tshirtType: selectedImage,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            uploadedImageFront,
            uploadedImageBack,
        };
        setCart([...cart, newItem]);
        setShowModal(true); // Show the modal after adding to the bag
    };
    const closeModal = () => setShowModal(false); // Close modal handler

    const handleAddToCart = async () => {
        setIsLoading(true);
        setShowModal(false);
        
        try {
            const customTshirtData = {
                tshirtType: selectedImage,
                color: selectedColor,
                size: selectedSize,
                quantity: quantity,
                frontImageUrl: uploadedImageFront,
                backImageUrl: uploadedImageBack,
                totalPrice: calculateTotalPrice()
            };

            if (user) {
                const response = await api.addCustomTshirtToCart(customTshirtData);
                if (response.status === "ok") {
                    cartDispatch({
                        type: "ADD_CUSTOM_TSHIRT",
                        payload: { ...customTshirtData, _id: response.customTshirtId }
                    });
                }
            } else {
                cartDispatch({
                    type: "ADD_CUSTOM_TSHIRT",
                    payload: customTshirtData
                });
            }

            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleMergeImages = (tshirtType, isFront) => {
        return new Promise((resolve) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            
            const tShirtImage = new Image();
            const customImage = new Image();
            
            tShirtImage.crossOrigin = "anonymous";
            customImage.crossOrigin = "anonymous";
    
            // Wait for both images to load
            Promise.all([
                new Promise((resolve) => {
                    tShirtImage.onload = () => resolve();
                    tShirtImage.src = tshirtType;
                }),
                new Promise((resolve) => {
                    customImage.onload = () => resolve();
                    customImage.src = isFront ? uploadedImageFront : uploadedImageBack;
                })
            ]).then(() => {
                // Process images after they're fully loaded
                ctx.drawImage(tShirtImage, 0, 0, canvas.width, canvas.height);
                
                const position = isFront ? imagePositionFront : imagePositionBack;
                ctx.drawImage(customImage, position.x, position.y, position.width, position.height);
                
                const mergedImageData = canvas.toDataURL("image/png");
                uploadToCloudinary(mergedImageData, isFront).then(resolve);
            });
        });
    };
    
    const uploadToCloudinary = async (imageData, isFront) => {
        const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dbxkrall1/image/upload";
        const UPLOAD_PRESET = "ujkreuzq";
    
        // Compress image while maintaining quality
        const compressedImage = await compressImage(imageData);
        
        const formData = new FormData();
        formData.append("file", compressedImage);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("format", "png");
    
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            priority: 'high'
        });
    
        const result = await response.json();
        return result.secure_url;
    };
    
    const compressImage = async (imageData) => {
        const img = new Image();
        img.src = imageData;
        
        return new Promise((resolve) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Maintain original dimensions
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Convert to blob with optimal compression
                canvas.toBlob(
                    (blob) => resolve(blob),
                    'image/png',
                    0.9 // High quality compression
                );
            };
        });
    };
    
    
    
        

    // Capture the final T-shirt image (front and back) as a single image
    const captureFinalImage = (isFront) => {
        if (previewRef.current) {
            html2canvas(previewRef.current, {
                backgroundColor: null, // Maintain transparency
                scale: 2, // Increase quality
                useCORS: true, // Fix image rendering issues
            }).then((canvas) => {
                const imageUrl = canvas.toDataURL("image/png");

                if (isFront) {
                    setPreviewImageFront(imageUrl);
                    localStorage.setItem("finalFrontImage", imageUrl);
                } else {
                    setPreviewImageBack(imageUrl);
                    localStorage.setItem("finalBackImage", imageUrl);
                }
            });
        }
    };
    const handleDragStop = (e, data, isFront) => {
        const { x, y } = data;
        const newPosition = { ...isFront ? imagePositionFront : imagePositionBack, x, y };
        if (isFront) {
            setImagePositionFront(newPosition);
        } else {
            setImagePositionBack(newPosition);
        }
    };

    const handleResizeStop = (e, direction, ref, delta, position, isFront) => {
        const { width, height } = ref.style;
        const newPosition = { ...isFront ? imagePositionFront : imagePositionBack, width: parseInt(width), height: parseInt(height) };
        if (isFront) {
            setImagePositionFront(newPosition);
        } else {
            setImagePositionBack(newPosition);
        }
    };

    const handleRotateStop = (newRotation, isFront) => {
        const newPosition = { ...isFront ? imagePositionFront : imagePositionBack, rotation: newRotation };
        if (isFront) {
            setImagePositionFront(newPosition);
        } else {
            setImagePositionBack(newPosition);
        }
    };
    // Fixed preview area for both normal & final preview
    const resetCustomization = () => {
        // Reset all states to initial values
        setSelectedImage("/images/crew_front.png");
        setSelectedColor("#ffffff");
        setSelectedSize("");
        setQuantity(1);
        setUploadedImageFront(null);
        setUploadedImageBack(null);
        setImagePositionFront({ x: 0, y: 0, width: 150, height: 150, rotation: 0 });
        setImagePositionBack({ x: 0, y: 0, width: 150, height: 150, rotation: 0 });
        
        // Reset file inputs
        if (fileInputRefFront.current) {
            fileInputRefFront.current.value = "";
        }
        if (fileInputRefBack.current) {
            fileInputRefBack.current.value = "";
        }
    };
    const handleImagePositionChange = (newPosition) => {
        setImagePositionFront(prevPosition => ({
            ...prevPosition,
            x: newPosition.x,
            y: newPosition.y,
            width: newPosition.width,
            height: newPosition.height,
            rotation: newPosition.rotation,
        }));
    };

    return (
        <div className="container">

{isLoading && (
            <div className="loader-overlay">
                <div className="loader"></div>
            </div>
        )}
        
        {showSuccess && (
            <SuccessAlert message="T-shirt added to cart successfully!" />
        )}
            <h1 className="text-center">Customize Your T-Shirt</h1>

            <div className="customization-container">
                <div className="options-panel">
                    <h4>Select T-Shirt Type</h4>
                    <select id="tshirttype" value={selectedImage} onChange={handleTshirtChange}>
                        <option value="/images/crew_front.png">Short Sleeve</option>
                        <option value="/images/mens_oversized_front.png">Oversized T-Shirt</option>
                        <option value="/images/mens_longsleeve_front.png">Long Sleeve</option>
                        <option value="/images/mens_hoodie_front.png">Hoodie</option>
                        <option value="/images/mens_tank_front.png">Tank Top</option>
                    </select>

                    <h4>Choose a Color</h4>
                    <div className="color-options">
                        {[
                            { title: "White", color: "#ffffff" },
                            { title: "Beige", color: "#BBA576" },
                            { title: "Charcoal", color: "#5b5b5b" },
                            { title: "Black", color: "#222222" },
                            { title: "Cherry Red", color: "#c50404" },
                            { title: "Lavender", color: "#9E68C6" },
                            { title: "Dark Green", color: "#05270B" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`color-circle ${selectedColor === item.color ? "selected" : ""}`}
                                title={item.title}
                                style={{ backgroundColor: item.color }}
                                onClick={() => handleColorChange(item.color)}
                            ></div>
                        ))}
                    </div>

                    <div className="size-options">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                            <label key={size} className="size-checkbox">
                                <input
                                    type="radio" // Use radio buttons for selecting only one size
                                    name="size"
                                    value={size}
                                    checked={selectedSize === size}
                                    onChange={() => setSelectedSize(size)} // Set the selected size when clicked
                                />
                                {size}
                            </label>
                        ))}

                        <h4>Quantity</h4>
                        <input
                            type="number"
                            className="quantity-input"
                            min="1"
                            max="10"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))} // Update quantity state
                        />
                    </div>

                    <div className="upload-buttons-container">
                        {/* Front Image Upload Section */}
                        <div className="upload-section">
                            <h4>Upload Custom Front Image</h4>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, true)}
                                ref={fileInputRefFront}
                            />

                            {uploadedImageFront && (
                                <div className="remove-image-btn" onClick={() => handleRemoveImage(true)}>
                                    <span>X</span>
                                </div>
                            )}

                            {previewImageFront && !uploadedImageFront && (
                                <div className="image-preview-container">
                                    <img src={previewImageFront} alt="Preview Front" className="uploaded-preview" />
                                    <button className="upload-btn" onClick={() => handleApplyImage(true)}>
                                        Apply to Front
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Back Image Upload Section */}
                        <div className="upload-section">
                            <h4>Upload Custom Back Image</h4>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, false)}
                                ref={fileInputRefBack}
                            />

                            {uploadedImageBack && (
                                <div className="remove-image-btn" onClick={() => handleRemoveImage(false)}>
                                    <span>X</span>
                                </div>
                            )}

                            {previewImageBack && !uploadedImageBack && (
                                <div className="image-preview-container">
                                    <img src={previewImageBack} alt="Preview Back" className="uploaded-preview" />
                                    <button className="upload-btn" onClick={() => handleApplyImage(false)}>
                                        Apply to Back
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pricing-container">
                    <div className="pricing-details">
    
    <div className="price-list">
        <div className="price-item">
            <span>Base Price:</span>
            <span>₹{basePrice}</span>
        </div>
        
        {selectedColor !== "#ffffff" && (
            <div className="price-item">
                <span>Color Price:</span>
                <span>₹{colorPrice}</span>
            </div>
        )}
        
        {selectedSize && ["XL", "XXL"].includes(selectedSize) && (
            <div className="price-item">
                <span>Size ({selectedSize}):</span>
                <span>₹{selectedSize === "XL" ? 30 : 50}</span>
            </div>
        )}
        
        {uploadedImageFront && (
            <div className="price-item">
                <span>Front Print:</span>
                <span>₹{printPrice}</span>
            </div>
        )}
        
        {uploadedImageBack && (
            <div className="price-item">
                <span>Back Print:</span>
                <span>₹{printPrice}</span>
            </div>
        )}
        
        {quantity > 1 && (
            <div className="price-item">
                <span>Quantity:</span>
                <span>x{quantity}</span>
            </div>
        )}
        
        <div className="price-item total">
            <span>Total Price:</span>
            <span>₹{calculateTotalPrice()}</span>
        </div>
    </div>
</div>

                    </div>

                    <div className="add-to-bag-container">
                        <div className="validation-error">
                            {validationError && <p className="error-message">{validationError}</p>}
                        </div>
                        <button className="add-to-bag-btn" onClick={handleAddToBag}>
                            Add to Bag
                        </button>
                    </div>
                </div>

                <div className="preview-panel">

                <canvas 
        ref={canvasRef} 
        width="600" 
        height="800" 
        style={{ display: 'none' }}
    />
                    <button className="toggle-view-btn" onClick={toggleView}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4v5h5"></path>
                            <path d="M20 20v-5h-5"></path>
                            <path d="M17 9a6 6 0 0 0-9.6-2"></path>
                            <path d="M7 15a6 6 0 0 0 9.6 2"></path>
                        </svg>
                    </button>

                    <div className="tshirt-preview" style={{ backgroundColor: selectedColor }}>
                        <img src={tshirtImage} alt="T-shirt Preview" className="tshirt-image" />

                        {/* Draggable and Resizable Image Container */}
                        <div className="image-drag-area">
                            {isFrontView && uploadedImageFront && (
                                <Rnd
                                    bounds="parent"
                                    minWidth={50}
                                    minHeight={50}
                                    size={{ width: imagePositionFront.width, height: imagePositionFront.height }}
                                    position={{
                                        x: Math.max(0, Math.min(imagePositionFront.x, 400)),  // Prevent going out of bounds horizontally
                                        y: Math.max(0, Math.min(imagePositionFront.y, 300)),  // Prevent going out of bounds vertically
                                    }}
                                    onDragStop={(e, data) => handleDragStop(e, data, true)}
                                    onResizeStop={(e, direction, ref, delta, position) => handleResizeStop(e, direction, ref, delta, position, true)}
                                    onRotateStop={(e, rotation) => handleRotateStop(rotation, true)}
                                >
                                    <img
                                        src={uploadedImageFront}
                                        alt="Uploaded Front Design"
                                        className="uploaded-design"
                                        style={{
                                            transform: `rotate(${imagePositionFront.rotation}deg)`,
                                        }}
                                    />
                                </Rnd>
                            )}

                            {!isFrontView && uploadedImageBack && (
                                <Rnd
                                    bounds="parent"
                                    minWidth={50}
                                    minHeight={50}
                                    size={{ width: imagePositionBack.width, height: imagePositionBack.height }}
                                    position={{
                                        x: Math.max(0, Math.min(imagePositionBack.x, 300)),  // Prevent going out of bounds horizontally
                                        y: Math.max(0, Math.min(imagePositionBack.y, 400)),  // Prevent going out of bounds vertically
                                    }}
                                    onDragStop={(e, data) => handleDragStop(e, data, false)}
                                    onResizeStop={(e, direction, ref, delta, position) => handleResizeStop(e, direction, ref, delta, position, false)}
                                    onRotateStop={(e, rotation) => handleRotateStop(rotation, false)}
                                >
                                    <img
                                        src={uploadedImageBack}
                                        alt="Uploaded Back Design"
                                        className="uploaded-design"
                                        style={{
                                            transform: `rotate(${imagePositionBack.rotation}deg)`,
                                        }}
                                    />
                                </Rnd>
                            )}
                        </div>
                        {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <span className="close-btn" onClick={closeModal}>&times;</span>
                                    <h2>Preview of Your Custom T-Shirt</h2>
                                    <div className="final-preview-container">
                                        {/* Front Preview Section */}
                                        <div className="final-preview-front">
        <h4>Front View</h4>
        <div 
            className="tshirt-preview" 
            style={{ 
                backgroundColor: selectedColor,
                position: 'relative',
                width: '300px',
                height: '400px'
            }}
        >
            <img 
                src={selectedImage} 
                alt="T-shirt Front" 
                className="tshirt-image" 
            />
            {uploadedImageFront && (
                <img
                    src={uploadedImageFront}
                    alt="Front Design"
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) rotate(${imagePositionFront.rotation}deg)`,
                        top: `${50 + imagePositionFront.y}%`,
                        left: `${50 + imagePositionFront.x}%`,
                        width: `${imagePositionFront.width}px`,
                        height: `${imagePositionFront.height}px`,
                        objectFit: 'contain'
                    }}
                />
            )}
        </div>
    </div>
                                        {/* Back Preview Section */}
                                        <div className="final-preview-back">
        <h4>Front View</h4>
        <div 
            className="tshirt-preview" 
            style={{ 
                backgroundColor: selectedColor,
                position: 'relative',
                width: '300px',
                height: '400px'
            }}
        >
            <img 
                src={selectedImage} 
                alt="T-shirt Back" 
                className="tshirt-image" 
            />
            {uploadedImageBack && (
                <img
                    src={uploadedImageBack}
                    alt="Back Design"
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) rotate(${imagePositionBack.rotation}deg)`,
                        top: `${50 + imagePositionBack.y}%`,
                        left: `${50 + imagePositionBack.x}%`,
                        width: `${imagePositionBack.width}px`,
                        height: `${imagePositionBack.height}px`,
                        objectFit: 'contain'
                    }}
                />
            )}
        </div>
    </div>
    </div>
    {/* Add this right before the modal-actions div */}
<div className="final-price-container">
    <div className="final-total">
        <span>Total Price ({quantity} {quantity > 1 ? 'items' : 'item'}):</span>
        <span className="price">₹{calculateTotalPrice()}</span>
    </div>
</div>

                                    {/* Optional: Add to Cart or Edit */}
                                    <div className="modal-actions">
                                        <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                            Add to Cart
                                        </button>
                                        <button className="edit-btn" onClick={closeModal}>
                                            Edit Design
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomizationCanvas;
