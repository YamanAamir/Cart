import { Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ClubCar from "./pages/ClubCar";
import EzGo from "./pages/EzGo";
import Yamaha from "./pages/Yamaha";
import ClubPro from "./pages/ClubPro";
import Checkout from "./pages/Checkout";
import DealerRegistration from "./components/DealerRegistration";
import GolfCartBuilder from "./pages/GolfCartBuilder";
import LoginPage from "./pages/Login";

import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import OurPolicies from "./pages/OurPolicies";

export default function App() {
  return (
    <CartProvider>
      <div className="app-container">

        <Routes>
          {/* 🔓 Public route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dealer-registration" element={<DealerRegistration />} />


          {/* 🔐 Everything else is protected */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <>
                  <TopBar />
                  <Header />
                  <Navigation />
                  <Outlet />
                  <Footer />
                </>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/clubcar" element={<ClubCar />} />
              <Route path="/ezgo" element={<EzGo />} />
              <Route path="/yamaha" element={<Yamaha />} />
              <Route path="/clubpro" element={<ClubPro />} />
              <Route path="/brand/:brandSlug" element={<GolfCartBuilder />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/our-policies" element={<OurPolicies />} />
            </Route>
          </Route>
        </Routes>

      </div>
    </CartProvider>
  );
}
