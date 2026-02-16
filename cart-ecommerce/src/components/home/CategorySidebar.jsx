// src/components/home/CategorySidebar.jsx
import { useState, useEffect } from "react";
import CategoryItem from "../common/CategoryItem";
import { BASE_API } from "../../utils/api";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";


export default function CategorySidebar() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const utilityBrand = {
    id: 9,
    name: "Utility",
    createdAt: "2025-12-23T20:19:09.219Z",
    updatedAt: "2026-01-19T16:25:56.919Z",
    path: "/brand/utility",
    logo: "/uploads/brands/1768839956724-109582124.png",
    models: [
      {
        id: 29,
        name: "Umax",
        brandId: 4,
        brandName: "Yamaha",
        createdAt: "2025-12-22T13:44:20.648Z",
        updatedAt: "2025-12-22T13:44:20.648Z",
      },
      {
        id: 18,
        name: "Carryall",
        brandId: 1,
        brandName: "ClubCar",
        createdAt: "2025-12-22T13:43:53.369Z",
        updatedAt: "2025-12-22T13:43:53.369Z",
      },
      {
        id: 19,
        name: "Carryall 502",
        brandId: 1,
        brandName: "ClubCar",
        createdAt: "2025-12-22T13:43:59.665Z",
        updatedAt: "2025-12-22T13:43:59.665Z",
      },
    ],
  };
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
  const normalBrands = brands.filter(
    (b) => b.name.toLowerCase() !== "utility"
  );
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
        ) : normalBrands.length === 0 ? (
          <li className="px-4 py-3 text-gray-500">No brands available</li>
        ) : (
          normalBrands.map((brand) => (
            <li key={brand.id}>
              <CategoryItem
                name={brand.name}
                logo={`https://api.clubpromfg.com${brand.logo}`}
                imgAlt={brand.imgAlt}
                path={brand.path}
                models={brand.models || []} // ← pass models array!
                variant="sidebar"
              />
            </li>
          ))
        )}
        {/* <UtilitySidebar /> */}
        <StaticCategoryItem
          name={utilityBrand.name}
          logo={`https://api.clubpromfg.com${utilityBrand.logo}`}
          imgAlt={utilityBrand.imgAlt}
          path={utilityBrand.path}
          models={utilityBrand.models || []} // ← pass models array!
          variant="sidebar"
          brandSlug={`/shop/${utilityBrand.models[0]?.brandName}`}
        />
      </ul>
    </div>
  );
}


const StaticCategoryItem = ({
  icon: Icon,
  name,
  logo,
  imgAlt,
  onClick,
  models = [],
  variant = "sidebar",
  brandSlug,
}) => {
  const hasModels = models?.length > 0;
  // const brandUrl =  `/shop/${encodeURIComponent(name)}`;

  const brandUrl = brandSlug
    ? brandSlug
    : `/shop/${encodeURIComponent(name)}`;
  const content = (
    <>
      <span className="font-medium text-gray-800 text-[15px] truncate flex-1">
        {name}
      </span>

      {hasModels && variant === "sidebar" && (
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition" />
      )}
    </>
  );

  /* ---------------- Sidebar variant ---------------- */
  if (variant === "sidebar") {
    return (
      <div className="group relative">
        <Link
          to={brandUrl}
          onClick={onClick}
          className="
            flex items-center gap-4
            px-4 py-3
            hover:bg-amber-50/80
            hover:text-amber-700
            rounded-lg
            transition-all duration-150
            border border-transparent
            hover:border-amber-200/40
          "
        >
          {content}
        </Link>

        {/* Models dropdown */}
        {hasModels && (
          <div
            className="
              absolute top-0 left-full ml-2
              w-64 bg-white rounded-xl shadow-xl border border-gray-200
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 z-50
              pointer-events-none group-hover:pointer-events-auto
            "
          >
            <div className="py-2 px-3 border-b border-gray-100">
              {logo ? (
                <img
                  src={logo}
                  alt={imgAlt || name}
                  className="w-full h-full object-contain p-1"
                />
              ) : Icon ? (
                <Icon className="w-6 h-6 text-gray-500" />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded" />
              )}
            </div>

            <ul className="py-1 max-h-80 overflow-y-auto">
              {models.map((model) => (
                <li key={model.id}>
                  <Link
                    to={`shop/${model.brandName}/${model.id}`}
                    className="
                      block px-4 py-2.5 text-sm text-gray-700
                      hover:bg-amber-50 hover:text-amber-700
                      transition-colors
                    "
                  >
                    {model.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  /* ---------------- Grid variant ---------------- */
  return (
    <Link
      to={brandUrl}
      onClick={onClick}
      className="
        bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300
        p-5 text-center cursor-pointer group border border-gray-100
        hover:border-amber-200/60 hover:-translate-y-0.5
        block
      "
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
        {logo ? (
          <img
            src={logo}
            alt={imgAlt || name}
            className="w-16 h-11 object-contain p-1.5"
          />
        ) : Icon ? (
          <Icon className="w-9 h-9 text-amber-600" />
        ) : null}
      </div>

      <p className="text-base font-semibold text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-2">
        {name}
      </p>
    </Link>
  );
}

