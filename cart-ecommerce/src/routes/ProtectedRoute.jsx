// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token"); // or auth context

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
