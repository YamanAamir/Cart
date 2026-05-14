import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { getAllHeroSections } from "../utils/apiCalls";
import { MAIN_SITE_URL } from "../utils/api";

export default function HeroSection() {
  const [heroes, setHeroes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch Hero Data
  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await getAllHeroSections();

        if (response?.data) {
          const activeHeroes = response.data.filter(
            (item) => item.isActive
          );

          setHeroes(activeHeroes);
        }
      } catch (error) {
        console.log("Hero fetch error:", error);
      }
    };

    fetchHeroes();
  }, []);

  // Auto Slide
  useEffect(() => {
    if (heroes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroes]);

  const currentHero = heroes[currentIndex];

  return (
    <div className="relative w-full md:h-[80vh] h-[900px] overflow-hidden bg-primary">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        {currentHero && (
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img
              src={`https://api.clubpromfg.com${currentHero.imageUrl}`}
              alt={currentHero.imgAlt || currentHero.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static Content */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16 container mx-auto">
        <div className="max-w-2xl text-white space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-2 px-3 border border-[#f9c821]/50 rounded-full text-[#f9c821] text-xs font-bold tracking-[0.2em] uppercase mb-4 backdrop-blur-sm">
              Premium Golf Accessories
            </span>

            <h1 className="text-[#f9c821] text-5xl md:text-6xl font-serif font-bold leading-tight drop-shadow-lg">
              Green Grass
              <br />
              <span className="text-white text-4xl">
                Build Your E-Z-GO, Club Car & Yamaha.
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-md md:text-lg text-gray-200 font-light max-w-lg leading-relaxed"
          >
            We’re currently enhancing the Club Pro Green Grass online
            experience to bring you a smoother, more powerful way to build and
            customize your products. During this development period, you may
            encounter occasional issues in the Build or Checkout process.
            <br />
            <br />
            If you experience any technical difficulties, our Customer Service
            team is ready to assist and ensure your order is completed without
            interruption.
            <br />
            <br />
            Thank you for choosing Club Pro Green Grass — we appreciate your
            patience as we continue to elevate your experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-4 pt-4 flex-wrap"
          >
            <Link to="/brand/ClubCar">
              <button className="bg-[#f9c821] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
                START BUILDING
              </button>
            </Link>

            <button
              onClick={() => {
                window.location.href =
                  "https://clubpromfg.com/quick-shop/";
              }}
              className="bg-[#f9c821] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg"
            >
              QUICK SHOP <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-primary/90 to-transparent pointer-events-none"></div>
    </div>
  );
}