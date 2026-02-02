import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]); // always an array

  // Add products to cart
  const addItem = (newItems) => {
    setCarts(prev => {
      const updated = [...prev];

      newItems.forEach(item => {
        const index = updated.findIndex(i => i.id === item.id);
        if (index > -1) {
          updated[index].qty += item.qty; // increase quantity if already exists
        } else {
          updated.push({ ...item }); // add new item
        }
      });
      console.log(updated);
      
      return updated;
    });
  };

  // Update quantity
  const updateQty = (id, qty) => {
    if (qty < 1) return; // prevent 0 or negative
    setCarts(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  // Remove product
  const removeItem = (id) => {
    setCarts(prev => prev.filter(item => item.id !== id));
  };

  // Clear all cart
  const clearCart = () => setCarts([]);

  return (
    <CartContext.Provider value={{ carts, addItem, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
