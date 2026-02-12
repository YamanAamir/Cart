import { Instagram, Facebook, Linkedin, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/api";


export default function Footer() {
  const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchBrands = async () => {
        try {
          setLoading(true);
          setError(null);
  
          // ← Replace with your actual API endpoint
          const response = await fetch(`${BASE_URL}/all-brands`, {
            headers: {
              Accept: "application/json",
              // add Authorization if needed: 'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          setBrands(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to load brands:", err);
          setError(err.message || "Could not load brands");
        } finally {
          setLoading(false);
        }
      };
  
      fetchBrands();
    }, []);

  return (
    <footer className="w-full bg-[#f9c821] text-black border-t border-white/10">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-black tracking-wider">CLUB PRO GOLF</h3>
            <p className="text-sm text-black leading-relaxed">
              Enhancing your golf experience with premium accessories since 1989. Quality you can trust, style you can feel.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase">Shop</h4>
            <ul className="space-y-2 text-sm text-black">
              {loading ? (
                <li className="px-4 py-3 text-gray-500 animate-pulse">
                  Loading brands...
                </li>
              ) : error ? (
                <li className="px-4 py-3 text-red-600">{error}</li>
              ) : brands.length === 0 ? (
                <li className="px-4 py-3 text-gray-500">No brands available</li>
              ) : (
                brands.map((brand) => (
                  <li key={brand.id} className="hover:text-black/80 transition-colors cursor-pointer">
                    <Link to={brand.path}>{brand.name}</Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase">Support</h4>
            <ul className="space-y-2 text-sm text-black">
              <li className="hover:text-black/80 transition-colors cursor-pointer"><Link to={"/contact"}>Contact Us</Link></li>
              <li className="hover:text-black/80 transition-colors cursor-pointer"><Link to={"/our-policies"}>Our Policies</Link></li>
              {/* <li className="hover:text-black/80 transition-colors cursor-pointer"><Link to={"/faq"}>FAQ</Link></li> */}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm tracking-widest uppercase">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:INFO@CLUBPRO.COM" className="flex items-center gap-2 text-sm text-black hover:text-black/80 transition-colors">
                <Mail className="w-4 h-4" /> INFO@CLUBPRO.COM
              </a>
              <a href="tel:18004672844" className="flex items-center gap-2 text-sm text-black hover:text-black/80 transition-colors">
                <Phone className="w-4 h-4" /> 1-800-467-2844
              </a>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {[Instagram, Facebook, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="bg-black hover:bg-black/80 p-2 rounded-full transition-all duration-300 group">
                  <Icon className="w-4 h-4 text-white group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-black">
          <p>© {new Date().getFullYear()} Club Pro Golf. All rights reserved - Developed by Elipse Studio</p>
          <div className="flex gap-6">
            <span className="hover:text-black/80 cursor-pointer"><Link to={"/our-policies"}>Privacy Policy</Link></span>
            <span className="hover:text-black/80 cursor-pointer"><Link to={"/our-policies"}>Terms of Service</Link></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
