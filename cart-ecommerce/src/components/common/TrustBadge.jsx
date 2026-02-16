import { Link } from "react-router-dom";

// src/components/common/TrustBadge.jsx
export default function TrustBadge({ title, value, link }) {
  return (
    <Link to={link} className="p-6 cursor-pointer border border-gray-300  rounded-xl hover:shadow-md transition">
      <div className="w-14 h-14 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
        ✓
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{value}</p>
    </Link>
  );
}