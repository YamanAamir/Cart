import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function CategoryItem({
  icon: Icon,
  name,
  logo,
  onClick,
  models = [],
  variant = "sidebar",
}) {
  const hasModels = models?.length > 0;
  const brandUrl = `/shop/${encodeURIComponent(name)}`;

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
                  alt={name}
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
                    to={`${brandUrl}/${model.id}`}
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
            alt={name}
            className="w-11 h-11 object-contain p-1.5"
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
