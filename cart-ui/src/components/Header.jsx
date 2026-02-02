import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Logo from "/assets/clubpro_logo.webp";

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Optional: call backend logout API
    // fetch("/api/logout", { method: "POST" });
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/10 backdrop-blur-md border-b border-white/30 px-8 py-4 flex items-center justify-between shadow-sm transition-all duration-300">
      {/* Logo */}
      <Link to="/">
        <img
          src={Logo}
          alt="Club Pro Golf Logo"
          className="h-16 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Right Actions - User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-2 bg-[#f9c821] p-2 rounded-full hover:bg-[#e8b71d] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#f9c821]/50"
          aria-label="User menu"
        >
          <User className="h-6 w-6 text-black" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 transform origin-top-right transition-all duration-200 ease-out scale-100 opacity-100"
          >
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-medium">View Profile</span>
            </Link>

            <hr className="my-1 border-gray-200" />

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150 text-left"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}