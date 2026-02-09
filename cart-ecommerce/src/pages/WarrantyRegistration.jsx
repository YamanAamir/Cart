import React, { useState } from "react";
import { BASE_API } from "../utils/api";

const WarrantyRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    model: "",
    purchase: "",
    discount: "yes",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_API}/register-warranty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Warranty registration failed");
      }

      const data = await response.json();
      console.log("Success:", data);

      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        model: "",
        purchase: "",
        discount: "yes",
      });
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-gray-50 px-4 py-24 md:py-24 sm:py-24 flex flex-col gap-2 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold  text-gray-800 mb-8">
        5-Year Warranty Registration
      </h1>

      <div className="space-y-4 mb-8">
        <p>
          Our 5-year warranty is the <strong>best in the industry</strong> for enclosures. No other
          enclosure company will match this, either because they don’t want to, or because they
          can’t.
        </p>
        <p>
          Once registered, throughout the life of the warranty, and often beyond, if an issue
          arises, please return the enclosure to our factory at your expense. We will repair it and
          return it to you at our expense. For issues arising within 60 days of registration, we
          will provide a shipping label for the return.
        </p>
        <p>
          The warranty covers all zippers, stitching, fabrics, and overall craftsmanship of the
          enclosure. Enclosures sent back unregistered or showing signs of neglect or abuse may be
          subject to a small repair fee.
        </p>
      </div>

      <h2 className="text-2xl font-semibold  mb-6">Register Your Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Two-column layout for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c821]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="mb-1 font-medium">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c821]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c821]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-1 font-medium">Phone (optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c821]"
            />
          </div>
        </div>

        {/* Full-width fields */}
        <div className="flex flex-col">
          <label htmlFor="model" className="mb-1 font-medium">Model & Color of Enclosure *</label>
          <input
            type="text"
            id="model"
            name="model"
            required
            value={formData.model}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c821]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="flex flex-col">
            <label htmlFor="purchase" className="mb-1 font-medium">Purchased Date *</label>
            <input
              type="date"
              id="purchase"
              name="purchase"
              required
              value={formData.purchase}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c821]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="discount" className="mb-1 font-medium">
              Interested in a 10% discount for an Instagram post?
            </label>
            <select
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c821]"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-[#f9c821] text-black font-semibold rounded-md hover:bg-[#e0b000] transition-colors"
        >
          {loading ? "Registering..." : "Register Warranty"}
        </button>
      </form>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {/* <p className="mt-4 text-sm text-gray-500">
        * All fields marked with an asterisk are required.
      </p> */}
    </div>
  );
};

export default WarrantyRegistration;
