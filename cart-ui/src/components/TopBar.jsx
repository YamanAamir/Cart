import { MoveLeft } from "lucide-react";
import { MAIN_SITE_URL } from "../utils/api";

export default function TopBar() {
  return (
    <div className="w-full bg-[#f9c821] border-b border-white/10 overflow-hidden">
      <div className="relative h-10 sm:h-12 md:h-14 flex items-center">
        
        {/* Return to Partner Site - Desktop */}

        {/* Static text for desktop */}
        <div className="hidden sm:flex w-full justify-center text-black font-bold tracking-wide text-sm md:text-md">
          <span className="mx-6">THE MOST TRUSTED GOLF CAR ACCESSORIES SINCE 1989</span>
          <span className="mx-4">•</span>
          <span className="mx-6">PREMIUM QUALITY GUARANTEED</span>
          <span className="mx-4">•</span>
          <span className="mx-6">INDUSTRY LEADING 5 YEAR ENCLOSURE WARRANTY</span>
        </div>

        {/* Moving marquee for mobile */}
        <div className="sm:hidden absolute whitespace-nowrap flex text-black font-bold text-xs tracking-wide animate-marquee">
          <span className="mx-4">THE MOST TRUSTED GOLF CAR ACCESSORIES SINCE 1989</span>
          <span className="mx-2">•</span>
          <span className="mx-4">PREMIUM QUALITY GUARANTEED</span>
          <span className="mx-2">•</span>
          <span className="mx-4">INDUSTRY LEADING 5 YEAR ENCLOSURE WARRANTY</span>
        </div>

      </div>
    </div>
  );
}
