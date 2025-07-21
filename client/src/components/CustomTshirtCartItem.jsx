import React, { useState } from 'react';
import { Plus, Minus, Trash, RefreshCw } from "react-feather";

export default function CustomTshirtCartItem({ 
    imgSrc, 
    name, 
    price, 
    quantity, 
    customDetails, 
    setQuantity 
}) {
    const [activeView, setActiveView] = useState('front');

    return (
        <div className="flex flex-wrap items-center m-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <section className="max-w-28 md:max-w-40 overflow-hidden mr-4 relative group">
                <img 
                    className="object-cover rounded-md w-full h-full transition-transform duration-300 group-hover:scale-105" 
                    src={activeView === 'front' ? customDetails.frontImageUrl : customDetails.backImageUrl}
                    alt={`${name} ${activeView} view`}
                />
                <button 
                    onClick={() => setActiveView(prev => prev === 'front' ? 'back' : 'front')}
                    className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                    <RefreshCw size={16} className="text-white" />
                </button>
            </section>

            <section className="flex-1 flex flex-col">
                <div className="mb-3">
                    <h3 className="text-lg font-medium text-gray-800">{name}</h3>
                    <p className="text-sm text-gray-500">Custom Design T-Shirt</p>
                </div>

                <div className="flex justify-between">
                    <div className="flex flex-col space-y-2 mr-2 py-2">
                        <div className="flex items-center">
                            <span className="font-bold mr-2">Price:</span> 
                            <span className="text-lg">₹{price}</span>
                        </div>

                        <div className="flex items-center">
                            <span className="font-bold mr-2">Color:</span> 
                            <div 
                                className="h-6 w-6 rounded-full border border-gray-200" 
                                style={{ backgroundColor: customDetails.color }}
                            />
                        </div>

                        <div className="flex items-center">
                            <span className="font-bold mr-2">Size:</span>
                            <span className="uppercase">{customDetails.size}</span>
                        </div>

                        <div className="flex items-center">
                            <span className="font-bold mr-2">Type:</span>
                            <span className="capitalize">
                                {customDetails.tshirtType.split('/').pop().split('_')[0].replace('-', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between flex-col items-end ml-auto space-y-4">
                        <div>
                            <span className="text-2xl font-semibold text-gray-900">₹{quantity * price}</span>
                        </div>

                        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                            {quantity > 1 ? (
                                <Minus 
                                    className="cursor-pointer hover:text-blue-600" 
                                    onClick={() => setQuantity(quantity - 1)} 
                                />
                            ) : (
                                <Trash 
                                    className="cursor-pointer hover:text-red-600" 
                                    onClick={() => setQuantity(quantity - 1)} 
                                />
                            )}
                            <span className="text-xl px-3 font-medium">{quantity}</span>
                            <Plus 
                                className="cursor-pointer hover:text-blue-600" 
                                onClick={() => setQuantity(quantity + 1)} 
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
