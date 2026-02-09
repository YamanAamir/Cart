// src/components/home/CategorySidebar.jsx
import { useState, useEffect } from "react";
import CategoryItem from "../common/CategoryItem";
import { BASE_API } from "../../utils/api";

export default function CategorySidebar() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);

        // ← Replace with your actual API endpoint
        const response = await fetch(`${BASE_API}/all-brands`, {
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
    <div className="hidden md:block w-full md:w-64 py-5 md:py-6 bg-white border border-gray-300 rounded-2xl p-4">
      <div className="px-4 mb-5">
        <h2 className="text-xl font-bold text-[#f9c821] flex items-center gap-2">
          <span className="text-2xl">≡</span> All Brands
        </h2>
      </div>

      <ul className="space-y-1 px-2">
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
            <li key={brand.id}>
              <CategoryItem
                name={brand.name}
                logo={`http://localhost:5000/${brand.logo}`}
                path={brand.path}
                models={brand.models || []} // ← pass models array!
                variant="sidebar"
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
