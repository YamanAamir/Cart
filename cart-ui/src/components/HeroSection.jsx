import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Images
// import hero1 from "/assets/hero1.webp";
import hero1 from "/assets/hero4.webp";
import hero2 from "/assets/hero2.webp";
import hero3 from "/assets/hero3.webp";
import { ChevronRight } from "lucide-react";

const images = [hero1, hero2, hero3];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full md:h-[80vh] h-[900px] overflow-hidden bg-primary">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt={`Hero ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
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
                Build Your EZ-GO, Club Car & Yamaha.
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-md md:text-lg text-gray-200 font-light max-w-lg leading-relaxed"
          >
            We’re currently enhancing the Club Pro Green Grass online experience
            to bring you a smoother, more powerful way to build and customize
            your products. During this development period, you may encounter
            occasional issues in the Build or Checkout process.
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
            className="flex gap-4 pt-4"
          >
            <Link to="/brand/ez-go">
              <button className="bg-[#f9c821] hover:bg-[#f9c821]-200 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 transform hover:scale-105 shadow-lg shadow-accent/20">
                START BUILDING
              </button>
            </Link>
            <button
              onClick={() => {
                window.location.href = "https://clubpromfg.com/quick-shop/";
              }}
              className="bg-[#f9c821] hover:bg-[#f9c821]-200 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg shadow-accent/20"
            >
              QUICK SHOP <ChevronRight className="w-5 h-5" />
            </button>

            {/* <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300">
              Learn More
            </button> */}
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Bottom Fade */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-primary/90 to-transparent pointer-events-none"></div>
    </div>
  );
}
