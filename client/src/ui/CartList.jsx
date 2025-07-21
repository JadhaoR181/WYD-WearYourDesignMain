import React from 'react'
import CartItem from "@/components/CartItem"
import CustomTshirtCartItem from "@/components/CustomTshirtCartItem"

export default function CartList({ items, setItemQuantity }) {
    return (
        <>
            {items.map(item => (
                item.type === 'custom' ? (
                    <CustomTshirtCartItem
                        key={item.id}
                        imgSrc={item.image}
                        name={item.title}
                        price={item.price}
                        quantity={item.quantity}
                        customDetails={item.customDetails}
                        setQuantity={qty => setItemQuantity(item.id, qty)}
                    />
                ) : (
                    <CartItem 
                        key={item.id}
                        imgSrc={item.image} 
                        name={item.title} 
                        price={item.price} 
                        quantity={item.quantity}
                        setQuantity={qty => setItemQuantity(item.id, qty)}
                    />
                )
            ))}
        </>
    )
}
