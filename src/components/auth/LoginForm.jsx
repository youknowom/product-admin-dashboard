// src/components/auth/LoginForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { setStoredAuth } from "@/lib/auth";
import Logo from "@/components/ui/Logo";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quick helper to fill test credentials
  const fillDemoCredentials = () => {
    setFormData({ username: "emilys", password: "emilyspass" });
    setErrors({});
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple clicks
    if (!validate()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const data = await authService.login(formData);
      // Save token & user profile
      setStoredAuth(data.accessToken || data.token, data);
      router.push("/products");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your username and password.";
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Logo size="lg" />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Sign in to manage your inventory and stock
        </p>
      </div>

      {/* Demo Credentials Helper Pill */}
      <div className="mb-6 p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 rounded-lg flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-orange-900 dark:text-orange-300">Demo User:</span>{" "}
          <code className="text-orange-700 dark:text-orange-400">emilys</code> /{" "}
          <code className="text-orange-700 dark:text-orange-400">emilyspass</code>
        </div>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="btn-glass-pill px-2.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/25 dark:border-orange-500/35 cursor-pointer"
        >
          Auto-fill
        </button>
      </div>

      {apiError && (
        <div
          role="alert"
          className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm"
        >
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="e.g. emilys"
            className={`w-full px-3.5 py-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.username
                ? "border-red-500 focus:ring-red-200"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-orange-500/20 focus:border-orange-500"
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`w-full px-3.5 py-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all ${
              errors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-zinc-300 dark:border-zinc-700 focus:ring-orange-500/20 focus:border-orange-500"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-glass-primary w-full py-2.5 px-4 rounded-full text-white font-semibold text-sm flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
