import { useCart } from "../context/CartContext";
import cardImg from "/assets/cpm_club_car.webp";
import { ArrowRight, Trash2, ShoppingCart, Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { api } from "../utils/api";
const stripePromise = loadStripe("pk_test_51SqJktJYkUUyRPvjEa2ZgYsjgiYBpp3LxxYbRnLCTkDjh84j6P7neAgiX09VqQd6AAVdQNsT5GShmCYFjYSjDoKJ00YYTJG23B"); // 🔑 Replace

export default function Checkout() {
  const { carts, updateQty, removeItem, clearCart } = useCart();
  const items = carts || []; // flat array of products

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );


  
 const handleStripeCheckout = async () => {
  const token = localStorage.getItem("token"); // get token at the time of request

  try {
    // Optional stock check
    const outOfStock = carts.find(item => item.qty > item.stock);
    if (outOfStock) {
      alert(`${outOfStock.name} is out of stock`);
      return;
    }

    // Prepare body
    const body = {
      items: carts.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
    };

    // Make the POST request with fetch
    const response = await fetch("https://api.clubpromfg.com/api/checkout/stripe-session", {
    // const response = await fetch("http://localhost:5000/api/checkout/stripe-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",       // very important
        "Authorization": `Bearer ${token}`,       // send JWT
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Stripe session request failed");
    }

    const data = await response.json();

    // Redirect to Stripe checkout
    window.location.href = data.url;

  } catch (err) {
    console.error("Stripe checkout failed:", err);
    alert("Checkout failed: " + err.message);
  }
};




  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-8 pb-20">
      {/* Page Header */}
      <div className="container mx-auto px-6 mb-6 md:mb-8">
        <h1 className="flex items-center gap-2 text-3xl md:text-5xl font-serif font-bold">
          <span className="text-gray-600">Your</span>
          <span className="text-[#f9c821]">Build</span>
        </h1>
      </div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* LEFT: Product Image */}
        <div className="lg:w-[65%]">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 h-[400px] lg:h-[700px] group transition-all duration-300">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${cardImg})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
              <span className="bg-[#f9c821]/90 text-white px-4 py-3 rounded-full text-xs font-bold tracking-widest">
                PREMIUM SERIES
              </span>
              <button className="bg-white/95 backdrop-blur-md border border-gray-300 px-6 py-3 rounded-full shadow-lg text-xs font-bold tracking-widest flex items-center gap-2 text-gray-900 cursor-default">
                NICE BUILD! <Check className="w-4 h-4 text-[#f9c821]" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Cart Details */}
        <div className="lg:w-[35%]">
          <div className="sticky top-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-300 pb-4">
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#f9c821] uppercase flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Your Selection
              </h2>
              {items.length > 0 && (
                <button
                  onClick={() => clearCart()}
                  className="text-xs text-red-600 hover:text-red-500 transition-colors font-bold tracking-wider"
                >
                  CLEAR CART
                </button>
              )}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-4 text-xs font-bold text-gray-500 mb-4 px-2 tracking-widest">
              <span className="col-span-2">ACCESSORY</span>
              <span className="text-center">QTY</span>
              <span className="text-right">TOTAL</span>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 max-h-[1000px] overflow-y-auto pr-2">
              {items.length > 0 ? (
                items.map((item) => {
                  const maxStock = item.stock || 0;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 border border-gray-300 p-4 rounded-xl hover:bg-gray-100 transition-colors group gap-4 md:gap-0 shadow-sm"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                        <div>
                          <p className="text-xs font-bold text-gray-800 uppercase leading-tight group-hover:text-gray-900 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Stock: {maxStock}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center justify-between w-full md:w-auto md:contents">
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mx-0 md:mx-4 shadow-sm">
                          <button
                            onClick={() =>
                              updateQty(item.id, Math.max(item.qty - 1, 1))
                            }
                            className="px-2 text-gray-600 hover:text-gray-900 font-bold transition-colors text-lg"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold min-w-[2rem] text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              updateQty(
                                item.id,
                                Math.min(item.qty + 1, maxStock)
                              )
                            }
                            className="px-2 text-gray-600 hover:text-gray-900 font-bold transition-colors text-lg"
                            disabled={item.qty >= maxStock}
                          >
                            +
                          </button>
                        </div>

                        {/* Total & Remove */}
                        <div className="flex items-center gap-4 md:gap-1 md:flex-col md:items-end">
                          <p className="text-sm font-bold min-w-[4rem] text-right text-[#f9c821]">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600/70 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-600 py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <p className="mb-6 text-lg">No items selected.</p>
                  <a
                    href="/club-pro/ezgo"
                    className="text-[#f9c821] hover:text-gray-900 underline text-sm font-bold tracking-widest"
                  >
                    BUILD YOUR CART
                  </a>
                </div>
              )}
            </div>

            {/* Subtotal & Checkout */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-600 tracking-widest uppercase">
                  Subtotal
                </span>
                <span className="text-3xl font-serif font-bold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleStripeCheckout}
                className="w-full bg-[#f9c821] hover:bg-[#e0b318] text-white font-bold text-sm tracking-[0.2em] py-5 rounded-xl shadow-lg shadow-[#f9c821]/30 transition-all hover:scale-[1.02] active:scale-98 uppercase flex items-center justify-center gap-3"
              >
                Check Out <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
