import { X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-200px)]">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">
              Your cart is empty
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>

                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>

                  <p className="font-bold text-[#f9c821]">${item.price}</p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-500 mt-1 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-5 border-t bg-white">
          <div className="flex justify-between mb-3 font-bold">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <button
  className="block w-full text-center py-3 bg-[#f9c821] hover:bg-yellow-500 text-white font-bold rounded-lg"
  onClick={() => {
    onClose();
    navigate("/checkout");
  }}
>
  Checkout
</button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
