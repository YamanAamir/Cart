// src/components/layout/MobileHeader.jsx
import { useState } from "react";
import { User, ShoppingCart, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import CartSidebar from "../ui/CartSidebar";
import { useCart } from "../../context/CartContext";
 import logo from '../clubpro_logo.webp';

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cartItems } = useCart();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
           
             <img src={logo} className="w-35 h-10" alt="" />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-5">
            {/* User */}
            <button className="text-gray-700 hover:text-amber-600">
              <User size={22} />
            </button>

            {/* Cart (OPEN SIDEBAR) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-700 hover:text-amber-600"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f9c821] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-gray-700 hover:text-amber-600"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`
          md:hidden fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl z-50
          transform transition-transform duration-300
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)}>✕</button>
        </div>

        <nav className="p-5 space-y-4">
          {[
            { to: "/", label: "Home" },
            { to: "/shop", label: "Shop" },
            { to: "/contact", label: "Contact" },
            { to: "/faqs", label: "FAQs" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className="block py-3 px-4 text-lg font-medium hover:bg-amber-50 rounded-lg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ================= CART SIDEBAR ================= */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
