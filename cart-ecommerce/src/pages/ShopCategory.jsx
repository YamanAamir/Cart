// src/pages/ShopCategory.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { BASE_API } from "../utils/api";
import SEO from "../components/common/SEO";

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
    fetchBrands();
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

        if (brandName) {
          params.set("brand", brandName);
        }

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
    : "Shop All";

  const SEO_DATA = brandName ? brands.find(b => b.name === brandName) : null;

  const utilityBrand = {
    "id": 9,
    "name": "Utility",
    "createdAt": "2025-12-23T20:19:09.219Z",
    "updatedAt": "2026-01-19T16:25:56.919Z",
    "path": "/brand/utility",
    "logo": "/uploads/brands/1768839956724-109582124.png",
    "models": [
      {
        "id": 29,
        "name": "Umax",
        "brandId": 4,
        "brandName": "Yamaha",
        "createdAt": "2025-12-22T13:44:20.648Z",
        "updatedAt": "2025-12-22T13:44:20.648Z"
      },
      {
        "id": 18,
        "name": "Carryall",
        "brandId": 1,
        "brandName": "ClubCar",
        "createdAt": "2025-12-22T13:43:53.369Z",
        "updatedAt": "2025-12-22T13:43:53.369Z"
      },
      {
        "id": 19,
        "name": "Carryall 502",
        "brandId": 1,
        "brandName": "ClubCar",
        "createdAt": "2025-12-22T13:43:59.665Z",
        "updatedAt": "2025-12-22T13:43:59.665Z"
      }
    ]
  };

  const normalBrands = brands.filter(
    (b) => b.name.toLowerCase() !== "utility"
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12 md:pt-0 pt-16">
      <SEO
        slug={!brandName ? "shop" : null}
        data={SEO_DATA}
        defaultTitle={brandName ? `${brandName} | Club Pro Mfg` : "Shop All | Club Pro Mfg"}
      />

      {/* Breadcrumbs */}
      <div className="bg-[#f9c821] border-b border-gray-200 sticky top-45 z-10 hidden md:block ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-sm ">
          <nav className="flex items-center gap-1.5 text-white">
            <Link to="/" className="hover:text-black">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-black">Shop</Link>
            <ChevronRight size={14} />
            <span className="font-medium text-text-white">{categoryTitle}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          className="lg:hidden mb-5 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm w-full justify-center font-medium"
          onClick={() => setShowMobileFilter(true)}
        >
          <SlidersHorizontal size={18} />
          Filters {selectedBrand ? `(${selectedBrand})` : ""}
        </button>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-full lg:w-72 bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-78 self-start">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              Brands
              <ChevronDown size={18} className="text-gray-500" />
            </h3>
            <div className="max-h-[60vh] overflow-y-auto space-y-1">
              {normalBrands.map((brand) => {
                const isSelected = selectedBrand === brand.name;
                return (
                  <div key={brand.id}>
                    <div className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${isSelected ? "bg-amber-50 text-[#f9c821] font-medium" : "hover:bg-gray-50 text-gray-700"}`}>
                      <Link to={`/shop/${encodeURIComponent(brand.name)}`} className="flex-1 text-left" onClick={() => setCurrentPage(1)}>
                        {brand.name}
                      </Link>
                      {brand.models?.length > 0 && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedBrand((prev) => prev === brand.name ? null : brand.name); }} className="ml-2">
                          <ChevronDown size={16} className={`transition-transform ${isSelected ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {brand.models?.length > 0 && isSelected && (
                      <ul className="mt-1 ml-4 pl-3 border-l-2 border-amber-200 space-y-1">
                        {brand.models.map((model) => (
                          <li key={model.id}>
                            <Link to={`/shop/${encodeURIComponent(brand.name)}/${model.id}`} className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-amber-50 hover:text-amber-700 transition-colors">
                              {model.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
              {utilityBrand && (
                <div className="mb-4">
                  <div className="px-3 py-2.5 rounded-lg bg-amber-50 text-[#f9c821] font-medium text-sm">Utility</div>
                  <ul className="mt-2 ml-4 pl-3 border-l-2 border-amber-300 space-y-1">
                    {utilityBrand.models.map((model) => (
                      <li key={model.id}>
                        <Link to={`/shop/${model.brandName}/${model.id}`} className="block px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-amber-50 hover:text-amber-700">
                          {model.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {categoryTitle} {products.length > 0 && `(${pagination.totalItems} Products)`}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="latest">Sort by: Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="w-full aspect-square bg-gray-200" />
                    <div className="p-4"><div className="h-5 bg-gray-200 rounded w-4/5 mb-2" /><div className="h-4 bg-gray-200 rounded w-3/5" /></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-red-600">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-gray-500">No products found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <Link key={product.id} to={`/product/${product.slug || product.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-200 group">
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={`https://api.clubpromfg.com/uploads/products/${product.imageOne || "placeholder.jpg"}`}
                        alt={product.seoTitle || product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 md:min-h-[3rem] text-sm sm:text-base">{product.name}</h3>
                      <div className="text-xs sm:text-sm text-gray-600 mb-2">{product.brand?.name} • {product.model?.name}</div>
                      <div className="text-xl font-bold text-amber-700">
                        ${(product.salePrice && parseFloat(product.salePrice) > 0 ? parseFloat(product.salePrice) : parseFloat(product.regularPrice || 0)).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-3">
                <button disabled={currentPage === 1 || loading} onClick={() => setCurrentPage((p) => p - 1)} className="px-5 py-2 border rounded-md disabled:opacity-50">Prev</button>
                <span>Page {currentPage} of {pagination.totalPages}</span>
                <button disabled={currentPage >= pagination.totalPages || loading} onClick={() => setCurrentPage((p) => p + 1)} className="px-5 py-2 border rounded-md disabled:opacity-50">Next</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {showMobileFilter && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filter by Brand</h3>
              <button onClick={() => setShowMobileFilter(false)}><ChevronDown size={24} className="rotate-180" /></button>
            </div>
            <div className="p-5 space-y-2">
              <button onClick={() => { setSelectedBrand(null); setShowMobileFilter(false); setCurrentPage(1); }} className="w-full text-left px-4 py-3 hover:bg-gray-50">All Brands</button>
              {brands.map((brand) => (
                <button key={brand.id} onClick={() => { setSelectedBrand(brand.name); setShowMobileFilter(false); setCurrentPage(1); }} className="w-full text-left px-4 py-3 hover:bg-gray-50">{brand.name}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
