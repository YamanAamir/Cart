import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function Navigation() {
  const { pathname } = useLocation();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
       const data = await api.get("/all-brands");
       
        setBrands(data);
      } catch (err) {
        console.error("Failed to load brands", err);
      }
    };

    fetchBrands();
  }, []);

  const links = [
    { name: "Home", path: "/" },
    ...brands, 
  ];

  return (
    <nav className="bg-white text-[#737a81] border-b border-white/10 shadow-lg relative z-40">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">

        <span className="text-xs font-extrabold tracking-[0.2em] uppercase hidden md:block py-6">
          Select Your Manufacturer
        </span>

        <div className="w-full md:w-auto overflow-x-auto flex gap-6 md:gap-8 no-scrollbar py-2 md:py-0">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-2 py-4 md:py-6 text-xs md:text-sm font-bold uppercase tracking-widest group hover:text-[#f9c821] whitespace-nowrap"
            >
              <span
                className={
                  pathname === link.path
                    ? "text-[#f9c821]"
                    : "text-[#737a81]"
                }
              >
                {link.name}
              </span>

              {pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-[#f9c821]"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
