// // src/components/home/HeroSection.jsx
// import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import hero1 from "/assets/hero1.webp";
// import hero2 from "/assets/hero2.webp";
// import hero3 from "/assets/hero3.webp";
// import { Link } from "react-router-dom";

// // Sample high-quality golf cart / product lifestyle images
// // You can replace these URLs with your own hosted images or from your backend
// const heroSlides = [
//   {
//     id: 1,
//     imageUrl:
//       hero1, // Modern golf cart on course
//     title: "Discover Premium Golf Carts",
//     subtitle: "ClubPro – Quality & Style Combined",
//   },
//   {
//     id: 2,
//     imageUrl:
//       hero2, // Lifestyle shot with people
//     title: "Ride in Comfort & Performance",
//     subtitle: "Perfect for Golf Courses & Neighborhoods",
//   },
//   {
//     id: 3,
//     imageUrl:
//       hero3, // Premium cart close-up
//     title: "Shop ClubPro Today",
//     subtitle: "Fast Delivery • Easy Financing",
//   },
//   // Add more as needed (4–6 recommended for hero)
// ];

// export default function HeroSection() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Auto-slide every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const goToSlide = (index) => {
//     setCurrentIndex(index);
//   };

//   const prevSlide = () => {
//     setCurrentIndex(
//       (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
//     );
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
//   };

//   return (
//     <div className="flex-1 relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[500px] rounded-2xl">
//       {/* Carousel Images */}
//       {heroSlides.map((slide, index) => (
//         <div
//           key={slide.id}
//           className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//             index === currentIndex ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <img
//             src={slide.imageUrl}
//             alt={slide.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-orange-50/70 via-[#f9c821]/40 to-black/60" />
//         </div>
//       ))}

//       {/* Content */}
//       <div className="absolute inset-0 z-10 flex items-center justify-center md:justify-start">
//         <div className="w-full max-w-4xl px-5 sm:px-8 md:px-12 lg:px-20 text-center md:text-left">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
//             {heroSlides[currentIndex].title}
//           </h1>
//           <p className="text-lg sm:text-xl md:text-2xl text-white/95 drop-shadow-md mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
//             {heroSlides[currentIndex].subtitle}
//           </p>

//           <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
//             <Link to={"/shop"}>
//               <button className="bg-[#f9c821] hover:bg-amber-600 text-white font-semibold px-8 py-3.5 sm:py-4 rounded-lg shadow-lg transition transform hover:scale-105">
//                 Shop Now →
//               </button>
//             </Link>
//             <button className="border-2 border-[#f9c821] text-[#f9c821] hover:bg-[#f9c821]/10 font-semibold px-8 py-3.5 sm:py-4 rounded-lg transition">
//               How ClubPro Works?
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Arrows - hide on very small screens if needed */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2.5 sm:p-3 rounded-full transition z-20 md:opacity-80"
//       >
//         <ChevronLeft size={28}  />
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition z-20"
//         aria-label="Next slide"
//       >
//         <ChevronRight size={28} />
//       </button>

//       {/* Dots Indicator */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
//         {heroSlides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => goToSlide(index)}
//             className={`w-3 h-3 rounded-full transition-all ${
//               index === currentIndex
//                 ? "bg-[#f9c821] scale-125"
//                 : "bg-white/60 hover:bg-white"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
// src/components/home/HeroSection.jsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api, BASE_API } from "../../utils/api";

const DEFAULT_SLIDES = [
  {
    id: "default-1",
    imageUrl: "/assets/hero1.webp",
    title: "Discover Premium Golf Carts",
    description: "ClubPro – Quality & Style Combined",
    ctaTextOne: "Shop Now",
    ctaLinkOne: "/shop",
    imgAlt: "Modern golf cart on course"
  }
];

export default function HeroSection() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSections = async () => {
      try {
        const res = await api.get("/all-hero-sections");
        const activeSlides = res.data.filter(s => s.isActive);
        setHeroSlides(activeSlides.length > 0 ? activeSlides : DEFAULT_SLIDES);
      } catch (error) {
        console.error("Failed to fetch hero sections:", error);
        setHeroSlides(DEFAULT_SLIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSections();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <Loader2 className="w-10 h-10 animate-spin text-[#f9c821]" />
      </div>
    );
  }

  const currentSlide = heroSlides[currentIndex];
  // Simple check to determine if imageUrl is a path or full URL
  const getImageUrl = (url) => {
    if (!url) return "/assets/hero1.webp";
    if (url.startsWith('http') || url.startsWith('/assets')) return url;
    // Replace '/api' from BASE_API to get root URL for uploads
    return `${BASE_API.replace('/api', '')}${url}`;
  };

  return (
    <div className="flex-1 relative overflow-hidden min-h-[320px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[500px] rounded-2xl bg-black">
      {/* Carousel Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={getImageUrl(slide.imageUrl)}
            alt={slide.imgAlt || slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/70 via-[#f9c821]/40 to-black/60" />

        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center md:justify-start">
        <div className="w-full max-w-4xl px-5 sm:px-8 md:px-12 lg:px-20 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
            {currentSlide.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 drop-shadow-md mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
            {currentSlide.description}
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            {currentSlide.ctaTextOne && (
              <Link to={currentSlide.ctaLinkOne || "/shop"}>
                <button className="bg-[#f9c821] hover:bg-amber-600 text-white font-semibold px-8 py-3.5 sm:py-4 rounded-lg shadow-lg transition transform hover:scale-105">
                  {currentSlide.ctaTextOne} →
                </button>
              </Link>
            )}
            {currentSlide.ctaTextTwo && (
              <Link to={currentSlide.ctaLinkTwo || "#"}>
                <button className="border-2 border-[#f9c821] text-white hover:bg-[#f9c821]/10 font-semibold px-8 py-3.5 sm:py-4 rounded-lg transition">
                  {currentSlide.ctaTextTwo}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2.5 sm:p-3 rounded-full transition z-20"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition z-20"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {heroSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                ? "bg-[#f9c821] scale-125"
                : "bg-white/60 hover:bg-white"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
