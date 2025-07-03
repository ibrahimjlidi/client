import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.product._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, { product, quantity }];
            }
        });
    };

    const updateQuantity = (productId, quantity) => {
        setCart(prev =>
            prev.map(item =>
                item.product._id === productId ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product._id !== productId));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}; 