import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, User } from "lucide-react";

export default function MobileBottomNav() {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center transition-colors ${
      isActive ? "text-[#f9c821]" : "text-gray-600 hover:text-[#f9c821]"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          
          {/* Home */}
          <NavLink to="/" className={linkClass}>
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>

          {/* Shop */}
          <NavLink to="/shop" className={linkClass}>
            <ShoppingBag size={24} />
            <span className="text-xs mt-1">Shop</span>
          </NavLink>

          {/* Account */}
          <NavLink to="/" className={linkClass}>
            <User size={24} />
            <span className="text-xs mt-1">Account</span>
          </NavLink>

        </div>
      </div>
    </nav>
  );
}
