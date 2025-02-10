import React from 'react';
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Check } from "react-feather";
import clsx from "clsx";

import Card from "./Card";

export default function Product({ link, imgSrc, title, price, onAddToCart, isInCart }) {
  return (
    <Card className="relative w-64 h-100 bg-white shadow-lg overflow-hidden m-2 flex flex-col justify-between">
      
      {/* Product Image Wrapper */}
      <div className="relative w-full h-3/4 bg-gray-100 group">
        <Link to={link}>
          <img 
            src={imgSrc} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Hover Buttons (Only on Image Hover) */}
        <div className={clsx(
          "absolute inset-0 flex justify-center items-center gap-3",
          "opacity-0 group-hover:opacity-100 group-hover:bg-black/30 transition duration-300"
        )}>
          {isInCart ? (
            <Link to="/cart">
              <ProductButton className="bg-green-500 text-white">
                <Check className='min-w-6' />
              </ProductButton>
            </Link>
          ) : ( 
            <ProductButton onClick={onAddToCart}>
              <ShoppingCart className='min-w-6' />
            </ProductButton>
          )}
          <Link to={link}>
            <ProductButton>
              <Search className='min-w-6' />
            </ProductButton>
          </Link>
        </div>
      </div>

      {/* Product Details (Title & Price) */}
      <div className="w-full bg-white py-2 px-3 text-center">
        <h3 className="text-gray-900 font-semibold text-sm truncate">{title}</h3>
        <p className="text-gray-600 font-bold">₹ {price}</p>
      </div>

    </Card>
  );
}

function ProductButton({ children, className, ...props }) {
  return (
    <button className={`m-2 bg-white w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 ease-out hover:(px-10) focus:outline-none ${className}`} {...props}>
      {children}
    </button>
  );
}
