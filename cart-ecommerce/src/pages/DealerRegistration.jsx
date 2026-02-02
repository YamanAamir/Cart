import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For redirection

import Logo from "/assets/clubpro_logo.webp";
import hero1 from "/assets/hero1.webp";
import hero2 from "/assets/hero2.webp";
import hero3 from "/assets/hero3.webp";
import yellowfadedcar from "../assets/image2.png";
import Footer from "./../components/layout/Footer";
// import TopBar from "./TopBar";
import { Link } from "react-router-dom";
import { BASE_API } from "../utils/api";

const images = [hero1, hero2, hero3];

const DealerRegistration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mobile: "",
    fax: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZip: "",
    billingCountry: "",
    commercialStreet: "",
    commercialCity: "",
    commercialState: "",
    commercialZip: "",
    commercialCountry: "",
    hasShowroom: "",
    interestedBrands: [],
    sellBrands: [],
    sellBrandsOther: "",
    authorizedDealer: [],
    authorizedDealersOther: "",
    resaleCertificate: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const interestedBrandOptions = [
    "Outfit My Fleet Lease Program",
    "Enclosures",
    "Maintenance/Utility",
    "Hard-good Accessories",
    "Soft-good Accessories",
    "Custom Orders",
    "Check All",
  ];

  const sellBrandOptions = [
    "Club Car",
    "E-Z-GO",
    "Yamaha",
    "Check All",
    "Other",
  ];

  const authorizedDealerOptions = [
    "Polaris",
    "Can-Am",
    "Yamaha",
    "Honda",
    "Kawasaki",
    "Cushman",
    "Umax",
    "Carry-All",
    "Other",
    "Check All",
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (["interestedBrands", "sellBrands", "authorizedDealer"].includes(name)) {
      const optionsMap = {
        interestedBrands: interestedBrandOptions,
        sellBrands: sellBrandOptions,
        authorizedDealer: authorizedDealerOptions,
      };
      const options = optionsMap[name];
      const realOptions = options.filter((item) => item !== "Check All");

      setFormData((prev) => {
        let updated = [...prev[name]];

        if (value === "Check All") {
          updated = checked ? [...realOptions] : [];
        } else {
          if (checked) {
            updated = [...new Set([...updated, value])];
          } else {
            updated = updated.filter((item) => item !== value);
          }
        }

        return { ...prev, [name]: updated };
      });
    }
  };

  const handleOtherChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);
  setErrorMessage("");

  try {
    const formDataObj = new FormData();

    // append all fields
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) =>
          formDataObj.append(`${key}[]`, item)
        );
      } else if (formData[key] !== null) {
        formDataObj.append(key, formData[key]);
      }
    });

    const res = await fetch(
      `${BASE_API}/dealer-registration`,
      
      {
        method: "POST",
        body: formDataObj, // ✅ FormData
      }
    );

    const result = await res.json();

    if (res.ok) {
      setSubmitStatus("success");
      setTimeout(() => navigate("/login"), 4000);
    } else {
      setSubmitStatus("error");
      setErrorMessage(result.error || "Registration failed");
    }
  } catch (err) {
    setSubmitStatus("error");
    setErrorMessage("Network error");
  } finally {
    setIsSubmitting(false);
  }
};


  // Hero image slideshow
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resaleCertificate: e.target.files[0],
    });
  };
  const handleSellTextChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      sellBrandsOther: e.target.value,
    }));

        console.log(formData);

  };
  const handleAuthorizedTextChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      authorizedDealersOther: e.target.value,
    }));

    console.log(formData);
    
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="w-full h-15 bg-[#f9c821] flex items-center overflow-hidden relative border-b border-white/10 flex justify-center">
      {/* Animated headline */}
      <div className="absolute whitespace-nowrap  text-black font-medium tracking-widest text-md">
        <span className="mx-8 font-bold">THE MOST TRUSTED GOLF CAR ACCESSORIES SINCE 1989</span>
        <span className="mx-8 font-bold text-black">•</span>
        <span className="mx-8 font-bold">PREMIUM QUALITY GUARANTEED</span>
        <span className="mx-8 font-bold text-black">•</span>
        <span className="mx-8 font-bold">FREE SHIPPING ON ORDERS OVER $500</span>
      </div>
    </div>
      <header className="sticky top-0 z-50 w-full bg-white/10 backdrop-blur-md border-b border-white/30 px-8 py-4 flex items-center justify-between shadow-sm">
        <Link to="/">
          <img
            src={Logo}
            alt="Club Pro Golf Logo"
            className="h-16 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </header>

      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Hero ${currentIndex + 1}`}
              className="w-full h-full object-cover absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </AnimatePresence>

          <div className="container mx-auto px-6 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Partner With Us
            </h1>
            <p className="text-gray-200 max-w-2xl text-lg">
              Join the Club Pro family as an authorized licensed dealer. Our
              goal is to provide your customers the right help for success by
              choosing an off-road vehicle brand that has been focused on
              customers' needs for years.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Benefits */}
          <div className="lg:col-span-1">
            <div className="bg-[#ffd042] text-white p-6">
              <h2 className="text-2xl font-bold mb-4">
                That's Why You Choose Club Pro
              </h2>
              <p className="mb-6 text-sm leading-relaxed">
                For over 50 years Club Pro has been supplying the UTV and ATV
                segments with innovative, high quality, thoroughly tested
                products at a low MSRP, bringing significant value to our
                dealers and consumers. Come and be part of the Club Pro family,
                create value from your business and take your business to the
                top.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Product Lines</h3>
                  <p className="text-sm">
                    We manufacture, distribute, and sell the biggest goods made
                    exclusively for all off-road model including Sport UTV and
                    ATV markets.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Pricing</h3>
                  <p className="text-sm">
                    We price our models and highly competitive structure with
                    seasoned MSRPs to grow your business.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Sales Team</h3>
                  <p className="text-sm">
                    We have one of the best trained and Club Pro-focused
                    customer service and dedicated sales teams for the industry.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Product Distribution
                  </h3>
                  <p className="text-sm">
                    At Club Pro, we have carefully managed logistics, streamline
                    products to speed up the time of delivery out of door
                    distribution from local distributors.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Club Pro Online</h3>
                  <p className="text-sm">
                    Our contemporary and latest website keeps all your delivered
                    content is always updated so up to date. We also publish new
                    data content to bring value to customer engagement.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden shadow-lg mt-8">
              <img
                src={yellowfadedcar}
                alt="Off-road vehicle"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right Side - Form or Success Message */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-md p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      className="w-12 h-12 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Thank You!
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    Your dealer registration has been submitted successfully.
                  </p>
                  <p className="text-md text-gray-500">
                    Redirecting you to the login page in 4 seconds...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg shadow-md p-8"
                >
                  <h2 className="text-3xl font-bold mb-2">
                    Green Grass Registration
                  </h2>

                  <p className="text-sm text-gray-700 mb-8">
                    Fill out the form below and one of our customer service
                    representatives will contact you within one business day to
                    complete your dealer sign-up process.
                  </p>

                  {/* Error Message */}
                  <AnimatePresence>
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
                      >
                        {errorMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit}>
                    {/* Company Information */}
                    <h3 className="text-xl font-bold mb-4">
                      Company Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Company Name*
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleOtherChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div></div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Name*
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First"
                          value={formData.firstName}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-end">
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last"
                          value={formData.lastName}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email*
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Phone*
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleOtherChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Fax
                        </label>
                        <input
                          type="tel"
                          name="fax"
                          value={formData.fax}
                          onChange={handleOtherChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Billing Address */}
                    <h3 className="text-xl font-bold mb-4">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Street*
                        </label>
                        <input
                          type="text"
                          name="billingStreet"
                          value={formData.billingStreet}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          name="billingCity"
                          value={formData.billingCity}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          State / Province*
                        </label>
                        <input
                          type="text"
                          name="billingState"
                          value={formData.billingState}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Postal / Zip Code*
                        </label>
                        <input
                          type="text"
                          name="billingZip"
                          value={formData.billingZip}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Country*
                        </label>
                        <select
                          name="billingCountry"
                          value={formData.billingCountry}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="MX">Mexico</option>
                        </select>
                      </div>
                    </div>

                    {/* Commercial Address */}
                    <h3 className="text-xl font-bold mb-4">
                      Commercial Address (Ship-to location)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Street*
                        </label>
                        <input
                          type="text"
                          name="commercialStreet"
                          value={formData.commercialStreet}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          name="commercialCity"
                          value={formData.commercialCity}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          State / Province*
                        </label>
                        <input
                          type="text"
                          name="commercialState"
                          value={formData.commercialState}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Postal / Zip Code*
                        </label>
                        <input
                          type="text"
                          name="commercialZip"
                          value={formData.commercialZip}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Country*
                        </label>
                        <select
                          name="commercialCountry"
                          value={formData.commercialCountry}
                          onChange={handleOtherChange}
                          required
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="MX">Mexico</option>
                        </select>
                      </div>
                    </div>

                    {/* Questionnaire */}
                    <h3 className="text-xl font-bold mb-4">
                      Short Questionnaire
                    </h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Do you have a Resale Certificate?*
                      </label>

                      <div className="flex items-center gap-6">
                        {/* Radio buttons */}
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="hasShowroom"
                              value="yes"
                              checked={formData.hasShowroom === "yes"}
                              onChange={handleOtherChange}
                              required
                              className="mr-2"
                            />
                            Yes
                          </label>

                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="hasShowroom"
                              value="no"
                              checked={formData.hasShowroom === "no"}
                              onChange={handleOtherChange}
                              required
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>

                        {/* File upload (only if Yes) */}
                        {formData.hasShowroom === "yes" && (
                          <div>
                            <input
                              type="file"
                              name="resaleCertificate"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleFileChange}
                              className="block text-sm text-gray-600
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-medium
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Which product categories are you most interested in?
                        (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {interestedBrandOptions.map((brand) => {
                          const isCheckAll = brand === "Check All";
                          const cleanOptions = interestedBrandOptions.filter(
                            (item) => item !== "Check All"
                          );
                          const allSelected =
                            formData.interestedBrands.length ===
                            cleanOptions.length;
                          const isChecked = isCheckAll
                            ? allSelected
                            : formData.interestedBrands.includes(brand);

                          return (
                            <label
                              key={brand}
                              className="flex items-center text-sm"
                            >
                              <input
                                type="checkbox"
                                value={brand}
                                name="interestedBrands"
                                checked={isChecked}
                                onChange={handleChange}
                              />
                              <span className="ml-2">{brand}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Are you an authorized purchaser for any of the following
                        PTV brands? (Select all that apply)
                      </label>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {sellBrandOptions.map((brand) => {
                          const isCheckAll = brand === "Check All";
                          const isOther = brand === "Other";

                          const cleanOptions = sellBrandOptions.filter(
                            (item) => item !== "Check All"
                          );

                          const allSelected =
                            formData.sellBrands.length === cleanOptions.length;

                          const isChecked = isCheckAll
                            ? allSelected
                            : formData.sellBrands.includes(brand);

                          return (
                            <div key={brand} className="flex flex-col">
                              <label className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  value={brand}
                                  name="sellBrands"
                                  checked={isChecked}
                                  onChange={handleChange}
                                />
                                <span className="ml-2">{brand}</span>
                              </label>

                              {/* Show textbox ONLY if Other is checked */}
                              {isOther &&
                                formData.sellBrands.includes("Other") && (
                                  <input
                                    type="text"
                                    placeholder="Please specify"
                                    className="mt-2 border rounded px-2 py-1 text-sm"
                                    value={formData.sellBrandsOther}
                                    onChange={handleSellTextChange}
                                  />
                                )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Are you an authorized purchaser for any of the following
                        UTV brands? (Select all that apply)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {authorizedDealerOptions.map((brand) => {
                          const isCheckAll = brand === "Check All";
                          const isOther = brand === "Other";
                          const cleanOptions = authorizedDealerOptions.filter(
                            (item) => item !== "Check All"
                          );
                          const allSelected =
                            formData.authorizedDealer.length ===
                            cleanOptions.length;
                          const isChecked = isCheckAll
                            ? allSelected
                            : formData.authorizedDealer.includes(brand);

                          return (
                            <>
                            <label
                              key={brand}
                              className="flex items-center text-sm"
                            >
                              <input
                                type="checkbox"
                                value={brand}
                                name="authorizedDealer"
                                checked={isChecked}
                                onChange={handleChange}
                              />
                              <span className="ml-2">{brand}</span>
                            </label>
                            {isOther &&
                                formData.authorizedDealer.includes("Other") && (
                                  <input
                                    type="text"
                                    placeholder="Please specify"
                                    className="mt-2 border rounded px-2 py-1 text-sm"
                                    value={formData.authorizedDealersOther}
                                    onChange={handleAuthorizedTextChange}
                                  />
                                )}
                                </>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-center text-sm">
                        * Indicates required field
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded transition-colors"
                    >
                      {isSubmitting ? "Submitting..." : "SUBMIT"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DealerRegistration;
