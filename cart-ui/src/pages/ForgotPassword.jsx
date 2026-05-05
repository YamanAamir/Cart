import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "../utils/api";

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // Step 1: Send reset code
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/customer/forgot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Something went wrong");
            console.log("data", data);

            // setMessage(
            //     data.sentTo === "email"
            //         ? "Reset code sent to your email!"
            //         : "Reset code sent to your WhatsApp number!"
            // );
            setMessage(data.message)
            setStep(2); // Move to Step 2
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/customer/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, code, newPassword, confirmNewPassword: confirmPassword }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f9c821] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-gray-50 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

                {step === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-100 text-green-700 p-3 rounded text-sm">
                                {message}
                            </div>
                        )}

                        <input
                            type="text"
                            required
                            placeholder="Enter email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full px-4 py-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-md text-white font-bold bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="w-full text-sm underline text-gray-600"
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-100 text-green-700 p-3 rounded text-sm">
                                {message}
                            </div>
                        )}

                        <input
                            type="text"
                            required
                            placeholder="Enter the code you received"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-4 py-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                        />

                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                required
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-md text-white font-bold bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
