import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CartSidebar from "./CartSidebar";
import { useCart } from "../../context/CartContext";

const MenuBar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <>
      {/* FULL-WIDTH BACKGROUND */}
      <div className="bg-gray-200 border-t border-gray-200">
        {/* CENTERED CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Nav */}
          <nav className="flex items-center gap-8">
            <Link to="/" className="font-medium hover:text-[#f9c821]">
              Home
            </Link>
            <Link to="/shop" className="font-medium hover:text-[#f9c821]">
              Shop
            </Link>
            <Link to="/contact" className="font-medium hover:text-[#f9c821]">
              Contact
            </Link>
          </nav>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-[#f9c821] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
};
export default MenuBar;
