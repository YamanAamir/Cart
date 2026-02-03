// src/components/layout/Header.jsx
import { Package, Phone, ShoppingCart, User } from "lucide-react";
import SearchBar from "../common/SeacrchBar";
import MenuBar from '../ui/MenuBar';
import logo from '../clubpro_logo.webp';
import { Link } from "react-router-dom";
import TopBar from "./TopBar";

export default function Header() {
  return (
    <>
      <header className=" hidden md:block bg-white shadow-sm sticky top-0 z-50">
        <TopBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to={"/"} className="flex flex-col justify-center items-center">
                <img src={logo} className="w-42 h-12" alt="" />
                <span className="text-xs mt-1 text-gray-700 text-center">
                  Green Grass and Quick Shop
                </span>
              </Link>
            </div>

            {/* Search - visible on medium+ */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-[#f9c821]" />
                <div className="text-sm">
                  <div>Call us now: <strong>+1 800 467 2844</strong></div>
                  <div className="text-xs text-gray-500">info@clubpro.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MenuBar />
      </header>
    </>
  );
}
