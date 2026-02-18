import { ChevronDown, LogOut, MoveLeft, MoveRight, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/api";


export default function TopBar() {

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
    <div className="bg-white text-gray-700 text-sm border border-gray-300 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-1.5">
          {/* Left - Call us */}
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-[#f9c821]" />
            <span>Call us for free: <strong>+1 800 467 2844</strong></span>
          </div>

          {/* Right - Login / Register */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex flex-row items-end gap-2">
              <a href={`${BASE_URL}/greengrass/`} className="mr-4 pb-1 flex flex-row justify-center items-center gap-2 text-base hover:underline underline-offset-4 transition-colors duration-200">
                <MoveLeft size={15}/> {" "} Return to Partner Site
              </a>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-[#f9c821] p-2 rounded-full hover:bg-[#e8b71d] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#f9c821]/50"
                aria-label="User menu"
              >
                <User className="h-6 w-6 text-black" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-56 bg-white z-99 rounded-xl shadow-xl border border-gray-200 py-2 transform origin-top-right transition-all duration-200 ease-out scale-100 opacity-100"
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
        </div>
      </div>
    </div>
  );
}