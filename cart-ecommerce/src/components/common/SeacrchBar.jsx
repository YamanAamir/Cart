// src/components/common/SearchBar.jsx
export default function SearchBar() {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f9c821]-500 focus:border-transparent transition"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f9c821] text-white p-2.5 rounded-full hover:bg-amber-600 transition">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
}