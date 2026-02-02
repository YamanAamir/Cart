import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingCart, Settings } from "lucide-react";
import gold from '../assets/Student Life.jpg';

const SuccessScreen = ({ onContinueConfiguring, handleResetModal, onClose }) => {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) return;

      const res = await fetch(
        `https://cap-stripe-webhook-backend.vercel.app/api/sendEmail/checkout-session?session_id=${sessionId}`
      );
      const data = await res.json();
      setSession(data);
    };

    fetchSession();
  }, [searchParams]);
 


  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading your order...</p>
      </div>
    );

  return (
    
    <div className="overflow-y-auto px-6 py-12">

        <div className="max-w-2xl mx-auto flex justify-center">
            <img src={gold} className="w-100 h-100"  />
        </div>
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You for Your Order!
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment was successful. We’ve sent a confirmation email to{" "}
          <span className="font-medium text-green-600">
            {session.customer_email}
          </span>
          .
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-1">Order Reference</p>
          <p className="font-bold text-gray-900">
            {session.metadata?.orderNumber}
          </p>

          <p className="text-sm text-gray-600 mt-4 mb-1">Total Paid</p>
          <p className="font-bold text-gray-900">
            {session.amount_total / 100} {session.currency.toUpperCase()}
          </p>

          <h3 className="text-sm text-gray-600 mt-4 mb-1">Items</h3>
          <ul className="list-disc pl-5 text-gray-800">
            {session.line_items?.data.map((item) => (
              <li key={item.id}>
                {item.description} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              handleResetModal?.();
              window.location.href =
                "https://shop.studentlife.dk/packages/";
              onClose?.();
            }}
            className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>

         
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
