import React from "react";
import { XCircle, ShoppingCart } from "lucide-react";

const CancelScreen = ({ handleResetModal, onClose }) => {
  return (
    <div className="overflow-y-auto px-6 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. If this was a mistake, you can try
          again or continue browsing our shop.
        </p>

        {/* Actions */}
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
            Back to Shop
          </button>

          <button
            onClick={() => {
              handleResetModal?.();
              window.location.href = "/checkout"; // adjust to your checkout route
            }}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelScreen;
