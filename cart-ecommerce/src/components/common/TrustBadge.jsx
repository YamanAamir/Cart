import { Link } from "react-router-dom";

const API_BASE_URL = "https://api.clubpromfg.com";

// src/components/common/TrustBadge.jsx
export default function TrustBadge({ title, value, link, imageUrl }) {
  return (
    <Link to={link || "#"} className="p-6 cursor-pointer border border-gray-300 rounded-xl hover:shadow-md transition">
      <div className={`w-20 h-20 mx-auto mb-4 ${imageUrl ? "" : "bg-amber-100 rounded-full"}  flex items-center justify-center text-2xl overflow-hidden`}>
        {imageUrl ? (
          <img
            src={`${API_BASE_URL}${imageUrl}`}
            alt={title}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          "✓"
        )}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{value}</p>
    </Link>
  );
}