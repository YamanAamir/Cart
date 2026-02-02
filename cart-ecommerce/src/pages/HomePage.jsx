// src/pages/HomePage.jsx
import CategorySidebar from "../components/home/CategorySidebar";
import HeroSection from "../components/home/HeroSection";
import TrustBadgesSection from "../components/home/TrustBadgesSection";
import TopCategoriesGrid from "../components/home/TopCategoriesGrid";

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border border-gray-300 ">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-4 pt-20 md:pt-4 md:p-4 ">
          <div className="flex flex-col md:flex-row md:gap-6 lg:gap-8">
            <CategorySidebar />
            <HeroSection />
          </div>
        </div>
      </div>

      <TrustBadgesSection />
      <TopCategoriesGrid />
    </div>
  );
}
