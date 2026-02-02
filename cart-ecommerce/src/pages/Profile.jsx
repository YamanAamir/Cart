// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Building2,
  Lock,
  Save,
  Loader2,
  Settings,
} from "lucide-react";
import { api, BASE_API } from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit"); // "edit" or "password"

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
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
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const data = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

      
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          billingStreet: data.billingStreet || "",
          billingCity: data.billingCity || "",
          billingState: data.billingState || "",
          billingZip: data.billingZip || "",
          billingCountry: data.billingCountry || "",
          commercialStreet: data.commercialStreet || "",
          commercialCity: data.commercialCity || "",
          commercialState: data.commercialState || "",
          commercialZip: data.commercialZip || "",
          commercialCountry: data.commercialCountry || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load profile");
        if (err.message.includes("Unauthorized")) navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_API}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

 const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setPasswordError("");
  setPasswordSuccess("");

  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    setPasswordError("All fields are required");
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    setPasswordError("New passwords do not match");
    return;
  }

  if (passwordForm.newPassword.length < 8) {
    setPasswordError("New password must be at least 8 characters");
    return;
  }

  setPasswordSaving(true);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${BASE_API}/profile-password`,
      
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // 👈 backend error comes here
      throw new Error(data.error || "Password update failed");
    }

    setPasswordSuccess("Password changed successfully!");
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    setTimeout(() => setPasswordSuccess(""), 4000);
  } catch (err) {
    setPasswordError(err.message);
  } finally {
    setPasswordSaving(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#f9c821]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-gradient-to-b from-[#f9c821] to-[#f0b500] p-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4">
                <Settings className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-black">Account Settings</h1>
              <p className="text-black/80 mt-2">Manage your profile</p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("edit")}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-left transition-all ${
                  activeTab === "edit"
                    ? "bg-black/20 text-black font-semibold shadow-md"
                    : "text-black/80 hover:bg-black/10"
                }`}
              >
                <User className="h-6 w-6" />
                <span className="text-lg">Edit Profile</span>
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-left transition-all ${
                  activeTab === "password"
                    ? "bg-black/20 text-black font-semibold shadow-md"
                    : "text-black/80 hover:bg-black/10"
                }`}
              >
                <Lock className="h-6 w-6" />
                <span className="text-lg">Change Password</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
            {activeTab === "edit" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>

                {error && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {success}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-8">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
                      <User className="h-5 w-5 text-[#f9c821]" />
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c821]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="inline h-4 w-4 mr-1" />Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#f9c821]" />
                      Billing Address
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Repeat inputs like before... */}
                      <input type="text" name="billingStreet" placeholder="Street" value={formData.billingStreet} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <input type="text" name="billingCity" placeholder="City" value={formData.billingCity} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <input type="text" name="billingState" placeholder="State" value={formData.billingState} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <input type="text" name="billingZip" placeholder="ZIP" value={formData.billingZip} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <div className="md:col-span-2">
                        <input type="text" name="billingCountry" placeholder="Country" value={formData.billingCountry} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      </div>
                    </div>
                  </div>

                  {/* Commercial Address */}
                  <div>
                    <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#f9c821]" />
                      Commercial / Shipping Address
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input type="text" name="commercialStreet" placeholder="Street" value={formData.commercialStreet} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <input type="text" name="commercialCity" placeholder="City" value={formData.commercialCity} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <input type="text" name="commercialState" placeholder="State" value={formData.commercialState} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <input type="text" name="commercialZip" placeholder="ZIP" value={formData.commercialZip} onChange={handleChange} className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      <div className="md:col-span-2">
                        <input type="text" name="commercialCountry" placeholder="Country" value={formData.commercialCountry} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#f9c821]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-3 bg-[#f9c821] hover:bg-[#e8b71d] text-black font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === "password" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Change Password</h2>

                {passwordError && (
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="max-w-lg">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c821]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c821]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        value={passwordForm.confirmNewPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f9c821]"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="flex items-center gap-3 bg-[#f9c821] hover:bg-[#e8b71d] text-black font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg disabled:opacity-70"
                    >
                      {passwordSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                      {passwordSaving ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}