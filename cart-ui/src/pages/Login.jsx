import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/assets/clubpro_logo.webp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://api.clubpromfg.com/api/customers/login", {
      // const res = await fetch("http://localhost:5000/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Store token
      
        localStorage.setItem("token", data.token);
      
      // Optional: store user info
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect after login
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9c821] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-gray-50 p-10 rounded-2xl">
        <div className="text-center">
         <div className="mx-auto w-50 flex items-center justify-center shadow-lg">
  <a
    href="https://clubpro.com/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src={Logo}
      alt="ClubPro Logo"
      className="cursor-pointer"
    />
  </a>
</div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            GREEN GRASS
          </h2>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            MEMBER LOGIN
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your account to manage orders and saved carts.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-orange-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-md text-white font-bold bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

         <div className="mt-10 text-center">
           <button
    className="w-full py-3 px-4 border-2 border-yellow-500 rounded-md text-yellow-600 font-bold hover:bg-yellow-50"
    onClick={() => navigate("/dealer-registration")}
  >
    Request Access
  </button>

  <div className="mt-6">
    <p className="text-sm text-gray-600">
      Looking for more information on Club Pro?{" "}
      <a
        href="https://clubpro.com/"
        className="text-yellow-600 font-semibold hover:underline"
      >
        Click Here
      </a>
    </p>
  </div>
        </div>
      </div>
    </div>
  );
}
