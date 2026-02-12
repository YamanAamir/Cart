// src/pages/CheckoutPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; // adjust path according to your folder structure
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import { loadStripe } from "@stripe/stripe-js";
import { BASE_API } from '../utils/api';
const stripePromise = loadStripe("pk_live_51S0HgIFDBW3pcErGOmI6vsVCXStMih46KJXjrOiFHppAj6h0tHOp4zDYMoLyTQn7Uk99pePatnCFrqLh6AAblGa300Wm8qbiRe");

const CheckoutPage = () => {
  const { cartItems, removeFromCart,clearCart } = useCart();

  // Safely convert price to number (handles string, number, invalid cases)
  const getPriceAsNumber = (price) => {
    const num = Number(price);
    return isNaN(num) ? 0 : num;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + getPriceAsNumber(item.price) * item.quantity;
  }, 0);

  const handleStripeCheckout = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please log in to proceed with checkout');
    return;
  }

  if (cartItems.length === 0) {
    alert('Your cart is empty');
    return;
  }

  try {
    const payload = {
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: getPriceAsNumber(item.price),
        qty: item.quantity,
      })),
    };

    const response = await fetch(
      `${BASE_API}/checkout/stripe-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to create Stripe checkout session');
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error('No checkout URL received from server');
    }

    // ── QUICK SOLUTION ──
    // Clear cart right before redirect
    clearCart();

    // Redirect to Stripe
    window.location.href = data.url;

  } catch (error) {
    console.error('Stripe checkout error:', error);
    alert(`Checkout failed: ${error.message}`);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-1 text-sm text-gray-600">
            Please review your order details before proceeding to payment
          </p>
        </div>

        {/* Cart Items Section */}
        <div className="p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg font-medium">
                Your cart is empty
              </p>
              <Link
                to="/products" // ← change to your actual products/shop route
                className="mt-4 inline-block px-6 py-3 bg-[#f9c821] hover:bg-yellow-500 text-white font-medium rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const price = getPriceAsNumber(item.price);
              const itemTotal = price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-5 border-b pb-6 last:border-b-0 last:pb-0"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name || 'Product'}
                      className="w-24 h-24 object-cover rounded-md border border-gray-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Unit price: ${price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* Price & Actions */}
                  <div className="text-right flex flex-col justify-between min-w-[140px]">
                    <p className="font-bold text-[#f9c821] text-lg">
                      ${itemTotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-3 text-red-600 hover:text-red-800 text-sm flex items-center gap-1.5 justify-end transition-colors"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Order Summary & Place Order */}
        {cartItems.length > 0 && (
          <div className="px-6 py-8 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-gray-900">
                Order Subtotal
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleStripeCheckout}
              className="w-full py-4 bg-[#f9c821] hover:bg-yellow-500 active:bg-yellow-600 
                       text-white font-bold text-lg rounded-lg transition-all shadow-md 
                       flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cartItems.length === 0}
            >
              Place Order
              <ArrowRight size={20} />
            </button>

            <p className="text-center text-sm text-gray-500 mt-5">
              You will be securely redirected to Stripe to complete your payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;