// src/App.jsx
// import { Routes, Route } from "react-router-dom";
// import MainLayout from "./components/layout/MainLayout";
// import HomePage from "./pages/HomePage";
// import ShopCategory from "./pages/ShopCategory";
// import ProductDetail from "./pages/ProductDetail";
// import Profile from "./pages/Profile";

// function App() {
//   return (
//     <MainLayout>
//       <Routes>
//         <Route path="/" element={<HomePage />} />

//         {/* General shop */}
//         <Route path="/shop" element={<ShopCategory />} />

//         {/* Brand page */}
//         <Route path="/shop/:brandName" element={<ShopCategory />} />

//         {/* Brand + Model page */}
//         <Route path="/shop/:brandName/:modelId" element={<ShopCategory />} />
//         <Route path="/product/:id" element={<ProductDetail />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </MainLayout>
//   );
// }

// export default App;


// src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import HomePage from "./pages/HomePage";
import ShopCategory from "./pages/ShopCategory";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";

import ProtectedRoute from "./routes/ProtectedRoute";
import DealerRegistration from "./pages/DealerRegistration";
import Profile from "./pages/Profile";
import CheckoutPage from "./pages/CheckoutPage";
import Contact from "./pages/Contact";
import OurPolicies from "./pages/OurPolicies";
import FAQs from "./pages/FAQs";
import WarrantyRegistration from "./pages/WarrantyRegistration";

function App() {
  return (
    
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />
      <Route path="/dealer-registration" element={<DealerRegistration />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/shop"
          element={
            <MainLayout>
              <ShopCategory />
            </MainLayout>
          }
        />

        <Route
          path="/shop/:brandName"
          element={
            <MainLayout>
              <ShopCategory />
            </MainLayout>
          }
        />

        <Route
          path="/shop/:brandName/:modelId"
          element={
            <MainLayout>
              <ShopCategory />
            </MainLayout>
          }
        />

        <Route
          path="/product/:id"
          element={
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <MainLayout>
              <CheckoutPage />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
        <Route
          path="/our-policies"
          element={
            <MainLayout>
              <OurPolicies />
            </MainLayout>
          }
        />
        <Route
          path="/Warranty-Policy"
          element={
            <MainLayout>
              <WarrantyRegistration />
            </MainLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <MainLayout>
              <FAQs />
            </MainLayout>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
