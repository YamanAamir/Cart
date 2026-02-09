// src/pages/ShopCategory.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BASE_API } from "../utils/api";

export default function ShopCategory() {
  const { brandName, modelId } = useParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sortBy, setSortBy] = useState("latest"); // latest, price-low, price-high
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
  });

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${BASE_API}/all-brands`);
        if (!res.ok) throw new Error("Failed to load brands");
        const data = await res.json();
        setBrands(data || []);
      } catch (err) {
        console.error("Brands fetch failed:", err);
      }
    };
    fetchBrands(); // brands loaded once
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "20",
          sort:
            sortBy === "price-low"
              ? "salePrice"
              : sortBy === "price-high"
                ? "salePrice"
                : "createdAt",
          order:
            sortBy === "price-low"
              ? "asc"
              : sortBy === "price-high"
                ? "desc"
                : "desc",
        });

        // 🔑 BRAND FILTER
        if (brandName) {
          params.set("brand", brandName);
        }

        // 🔑 MODEL FILTER
        if (modelId) {
          params.set("modelId", modelId);
        }

        const url = `${BASE_API}/products?${params}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setProducts(data.data || []);
        setPagination(data.pagination || { totalItems: 0, totalPages: 1 });
      } catch (err) {
        console.error(err);
        setError("Could not load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandName, modelId, sortBy, currentPage]);

  useEffect(() => {
    if (brandName) {
      setSelectedBrand(brandName);
    } else {
      setSelectedBrand(null);
    }

    setCurrentPage(1);
  }, [brandName, modelId]);


  const categoryTitle = brandName
    ? brandName.charAt(0).toUpperCase() + brandName.slice(1)
    : "";

  return (
    <div className="bg-gray-50 min-h-screen pb-12 ">
      {/* Breadcrumbs + Track Order */}
      <div className="bg-[#f9c821] border-b border-gray-200 sticky top-45 z-10 hidden md:block ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-sm ">
          <nav className="flex items-center gap-1.5 text-white">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-black">
              Shop
            </Link>
            <ChevronRight size={14} />
            <span className="font-medium text-text-white">{categoryTitle}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Filter Button */}
        <button
          className="lg:hidden mb-5 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm w-full justify-center font-medium"
          onClick={() => setShowMobileFilter(true)}
        >
          <SlidersHorizontal size={18} />
          Filters {selectedBrand ? `(${selectedBrand})` : ""}
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar – Brands */}
          <aside className="hidden lg:block w-full lg:w-72 bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-78 self-start">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              Brands
              <ChevronDown size={18} className="text-gray-500" />
            </h3>
            <div className="max-h-[60vh] overflow-y-auto space-y-1">
              {brands.map((brand) => {
                const isSelected = selectedBrand === brand.name;

                return (
                  <div key={brand.id}>
                    <div
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${isSelected
                          ? "bg-amber-50 text-[#f9c821] font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      {/* Brand name → navigate */}
                      <Link
                        to={`/shop/${encodeURIComponent(brand.name)}`}
                        className="flex-1 text-left"
                        onClick={() => setCurrentPage(1)}
                      >
                        {brand.name}
                      </Link>

                      {/* Chevron → toggle dropdown */}
                      {brand.models?.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBrand((prev) =>
                              prev === brand.name ? null : brand.name
                            );
                          }}
                          className="ml-2"
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${isSelected ? "rotate-180" : ""
                              }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Dropdown BELOW brand */}
                    {brand.models?.length > 0 && (
                      <div
                        className={`overflow-hidden transition-all duration-200 ${isSelected
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                          }`}
                      >
                        <ul className="mt-1 ml-4 pl-3 border-l-2 border-amber-200 space-y-1">
                          {brand.models.map((model) => (
                            <li key={model.id}>
                              <Link
                                to={`/shop/${encodeURIComponent(brand.name)}/${model.id
                                  }`}
                                className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-amber-50 hover:text-amber-700 transition-colors"
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
              })}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {categoryTitle}{" "}
                {products.length > 0 && `(${pagination.totalItems} Products)`}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>Show: 20</option>
                  <option>Show: 40</option>
                  <option>Show: 60</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden animate-pulse"
                  >
                    <div className="w-full aspect-[3/4] bg-gray-200" />
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/5 mb-3" />
                      <div className="h-5 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-600 font-medium">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No products found for this filter
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-200 group"
                  >
                    {/* Square image only */}
                    <div className="relative w-full aspect-square bggray-100 overflow-hidden">
                      <img
                        src={`https://api.clubpromfg.com//uploads/products/${product.imageOne || "placeholder.jpg"
                          }`}
                        alt={product.name}
                        className="absolute inset-0 w-full h54 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 md:min-h-[3rem] mb-1 group-hover:text-amber-700 text-sm sm:text-base">
                        {product.name}
                      </h3>
                      <div className="text-xs sm:text-sm text-gray-600 mb-2">
                        {product.brand?.name} • {product.model?.name} • {product?.color || "N/A"}
                        {/* <p>Color: {product?.color || "N/A"}</p> */}
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-xl sm:text-2xl font-bold text-amber-700">
                          $
                          {(
                            product.salePrice && parseFloat(product.salePrice) > 0
                              ? parseFloat(product.salePrice)
                              : parseFloat(product.regularPrice || 0)
                          ).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>

                        {product.salePrice &&
                          parseFloat(product.salePrice) > 0 &&
                          parseFloat(product.salePrice) < parseFloat(product.regularPrice || 0) && (
                            <span className="text-sm text-gray-500 line-through">
                              ${parseFloat(product.regularPrice).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-3 flex-wrap">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-5 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="px-4 py-2 font-medium">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <button
                  disabled={currentPage >= pagination.totalPages || loading}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-5 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-black/60 z-50 lg:hidden flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filter by Brand</h3>
              <button onClick={() => setShowMobileFilter(false)}>
                <ChevronDown size={24} className="rotate-180" />
              </button>
            </div>

            <div className="p-5 space-y-2">
              <button
                onClick={() => {
                  setSelectedBrand(null);
                  setShowMobileFilter(false);
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg ${!selectedBrand
                    ? "bg-amber-50 text-amber-800 font-medium"
                    : "hover:bg-gray-50"
                  }`}
              >
                All Brands
              </button>

              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand((prev) =>
                      prev === brand.name ? null : brand.name
                    );
                    setShowMobileFilter(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg ${selectedBrand === brand.name
                      ? "bg-amber-50 text-amber-800 font-medium"
                      : "hover:bg-gray-50"
                    }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
