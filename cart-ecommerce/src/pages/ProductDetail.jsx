import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BASE_API } from "../utils/api";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import SEO from "../components/common/SEO";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const isId = /^\d+$/.test(slug);
        const endpoint = isId ? `/product/${slug}` : `/product/slug/${slug}`;

        const res = await fetch(`${BASE_API}${endpoint}`);
        if (!res.ok) throw new Error("Failed to load product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">Loading product...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-10 text-center text-red-600 font-medium">
        Product not found
      </div>
    );
  }


  //   const getCart = () => {
  //   try {
  //     return JSON.parse(localStorage.getItem("cart")) || [];
  //   } catch {
  //     return [];
  //   }
  // };

  // const saveCart = (cart) => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // };
  // const handleAddToCart = () => {
  //   const cart = getCart();

  //   const existingItem = cart.find((item) => item.id === product.id);

  //   if (existingItem) {
  //     existingItem.quantity += quantity;
  //   } else {
  //     cart.push({
  //       id: product.id,
  //       name: product.name,
  //       price: product.salePrice,
  //       image: product.imageOne,
  //       brand: product.brand?.name,
  //       model: product.model?.name,
  //       quantity,
  //     });
  //   }

  //   saveCart(cart);

  // };

  const images = [
    product.imageOne,
    product.imageTwo,
    product.imageThree,
    product.imageFour,
  ].filter(Boolean);

  const altTexts = [
    product.imgAltOne,
    product.imgAltTwo,
    product.imgAltThree,
    product.imgAltFour,
  ].filter((_, i) => [product.imageOne, product.imageTwo, product.imageThree, product.imageFour][i]);

  const isOutOfStock = product.stock === 0;

  return (
    <>
      <SEO data={product} />
      <div className="bg-[#f9c821] border-b border-gray-200 sticky top-45 z-10 mb-6 hidden md:block">
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
            <Link to={`/shop/${encodeURIComponent(product.brand?.name)}`} className="hover:text-black">
              {product.brand?.name}
            </Link>
            <ChevronRight size={14} />
            <Link to={`/shop/${encodeURIComponent(product.brand?.name)}/${product.model?.id}`} className="hover:text-black">
              {product.model?.name}
            </Link>
            <ChevronRight size={14} />
            <span className="font-medium text-text-white">{product.name}</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto  py-12 md:py-12 px-8 mt-10">
        {/* Breadcrumb */}

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-10 ">
          {/* <div className="w-100 mx-auto md:w-full md:mx-0 ">
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
              <div className="w-full bg-white p-10 flex justify-center items-center h-[350px] md:h-[580px] lg:h-[650px] transition-all duration-300">

                <img
                  src={`https://api.clubpromfg.com/uploads/products/${images[activeImage]}`}
                  alt={altTexts[activeImage] || product.seoTitle || product.name}
                  className="max-w-full max-h-full object-contain"
                />

              </div>
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-600 text-white text-2xl font-bold px-8 py-3 rounded-lg rotate-[-15deg] shadow-lg">
                    SOLD OUT
                  </span>
                </div>
              )}

              {images.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow"
                >
                  <ArrowLeft />
                </button>
              )}

              {images.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow"
                >
                  <ArrowRight />
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 justify-center">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`border-2 rounded-lg overflow-hidden w-20 h-20 ${activeImage === index
                      ? "border-[#f9c821]"
                      : "border-transparent"
                      }`}
                  >
                    <img
                      src={`https://api.clubpromfg.com/uploads/products/${img}`}
                      alt={altTexts[index] || `${product.seoTitle || product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div> */}
          <div className="w-100 mx-auto md:w-full md:mx-0">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg flex">
              <div className="h-inherit flex justify-center items-center">

                {images.length > 1 && (
                  <div className="flex flex-col gap-3 p-3 ">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`border-2 rounded-lg overflow-hidden w-16 h-16 ${activeImage === index
                          ? "border-[#f9c821]"
                          : "border-transparent"
                          }`}
                      >
                        <img
                          src={`https://api.clubpromfg.com/uploads/products/${img}`}
                          alt={
                            altTexts[index] ||
                            `${product.seoTitle || product.name} thumbnail ${index + 1}`
                          }
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 flex justify-center items-center bg-white p-10 h-[350px] md:h-[580px] lg:h-[650px] transition-all duration-300 relative">

                <img
                  src={`https://api.clubpromfg.com/uploads/products/${images[activeImage]}`}
                  alt={altTexts[activeImage] || product.seoTitle || product.name}
                  className="max-w-full max-h-full object-contain"
                />

                {/* SOLD OUT */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-600 text-white text-2xl font-bold px-8 py-3 rounded-lg rotate-[-15deg] shadow-lg">
                      SOLD OUT
                    </span>
                  </div>
                )}

                {/* Prev */}
                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow"
                  >
                    <ArrowLeft />
                  </button>
                )}

                {/* Next */}
                {images.length > 1 && (
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow"
                  >
                    <ArrowRight />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-yellow-400 text-xl">
                ★★★★★ <span className="text-gray-400 ml-1">(0)</span>
              </div>
              <span className="text-gray-500 text-sm">
                (0 customer reviews)
              </span>
            </div>

            <p className="mb-4 text-black underline">
              Supplied and Shipped by{" "}
              <span className="font-medium">Club Pro</span>
            </p>

            <div
              className="text-gray-600 mb-6 space-y-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />


            <div className="flex items-baseline gap-3">
              <span className="text-4xl md:text-5xl font-bold text-[#f9c821]">
                $
                {(
                  product.regularPrice && parseFloat(product.regularPrice) > 0
                    ? parseFloat(product.regularPrice)
                    : parseFloat(product.regularPrice || 0)
                ).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>

            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Quantity</span>

              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-lg hover:bg-gray-100"
                >
                  −
                </button>

                <span className="px-5 font-medium">{quantity}</span>

                <button
                  onClick={() => {

                    setQuantity((q) => q + 1)


                  }}
                  className="px-4 py-2 text-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                if (isOutOfStock) return;
                const priceToUse = product.salePrice && parseFloat(product.salePrice) > 0
                  ? parseFloat(product.salePrice)
                  : parseFloat(product.regularPrice || 0);

                setAdded(true);
                setTimeout(() => setAdded(false), 1800);

                addToCart({
                  id: product.id,
                  name: product.name,
                  price: priceToUse,
                  image: `https://api.clubpromfg.com/uploads/products/${images[0]}`,
                  quantity: quantity
                })
              }}
              disabled={isOutOfStock}
              className={`w-full py-5 text-xl font-bold rounded-xl transition shadow-lg ${isOutOfStock
                ? "bg-gray-400 text-white cursor-not-allowed"
                : added
                  ? "bg-green-500 text-white"
                  : "bg-[#f9c821] hover:bg-yellow-500 text-white"
                }`}
            >
              {isOutOfStock ? "Out of Stock" : added ? "Added to Cart ✓" : "Add to Cart"}
            </button>

            <div className="mt-8 text-sm text-gray-500">
              <p>Brand: {product.brand.name}</p>
              <p className="mt-1">Model: {product.model.name}</p>
              <p className="mt-1">Product Type: {product.productType.name}</p>


            </div>
          </div>
        </div>
      </div>
    </>
  );
}
