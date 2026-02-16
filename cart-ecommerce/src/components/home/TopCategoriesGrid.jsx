// src/components/home/TopCategoriesGrid.jsx
import { useState, useEffect } from "react";
import CategoryItem from "../common/CategoryItem";
import { BASE_API } from "../../utils/api";

export default function TopCategoriesGrid() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${BASE_API}/all-brands`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch brands: ${response.status}`);
        }

        const data = await response.json();
        setBrands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Brands fetch error:", err);
        setError(err.message || "Failed to load top brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Optional: show only first 12 items
  const displayedBrands = brands.slice(0, 12);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12 text-gray-800">
          Top Brands
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-screen-lg">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-[calc(33.333%-1rem)] sm:w-[calc(25%-1.5rem)] md:w-[calc(16.666%-1.5rem)] lg:w-[calc(12.5%-1.5rem)] 
                             bg-white rounded-2xl p-5 animate-pulse flex-shrink-0"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-medium">{error}</p>
        ) : displayedBrands.length === 0 ? (
          <p className="text-center text-gray-500">No brands available</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {displayedBrands.map((brand) => (
              <div
                key={brand.id}
                className="
                  w-[calc(33.333%-1rem)] 
                  sm:w-[calc(25%-1.5rem)] 
                  md:w-[calc(16.666%-1.5rem)] 
                  lg:w-[calc(12.5%-1.5rem)] 
                  flex-shrink-0
                "
              >
                <CategoryItem
                  name={brand.name}
                  logo={`https://api.clubpromfg.com${brand.logo}`}
                  imgAlt={brand.imgAlt}
                  models={brand.models || []}
                  variant="grid"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
