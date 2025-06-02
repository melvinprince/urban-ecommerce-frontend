// components/LoginRegister/AuthForm.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";
import FeatureCounterCarousel from "../common/FeatureCounterCarousel";

const features = [
  { text: "Fast Delivery", svg: "/svg/fast-delivery.svg" },
  { text: "Highest Quality", svg: "/svg/expectional.svg" },
  { text: "Secure Payment", svg: "/svg/secure-payment.svg" },
  { text: "24/7 Support", svg: "/svg/customer.svg" },
  { text: "Customer Satisfaction", svg: "/svg/meter.svg" },
];

export default function AuthForm() {
  // Local tab state
  const [activeTab, setActiveTab] = useState("login");

  // Select each Zustand value/action individually
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const redirectPath = useAuthStore((state) => state.redirectPath);
  const setRedirectPath = useAuthStore((state) => state.setRedirectPath);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  // Pop‐up actions
  const showSuccess = usePopupStore((state) => state.showSuccess);
  const showError = usePopupStore((state) => state.showError);

  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Initialize auth once on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Redirect effect: only when isLoggedIn becomes true
  useEffect(() => {
    if (!isLoggedIn) return;
    const destination = redirectPath || "/";
    router.push(destination);
    setRedirectPath("/");
    // We intentionally leave out `redirectPath` from dependencies
    // so this block only runs when `isLoggedIn` first becomes true.
  }, [isLoggedIn, router, setRedirectPath]);

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { message } = await apiService.auth.login({ email, password });
      await refreshUser(); // fetch fresh user info
      showSuccess(message || "Logged in successfully!");
      const last = localStorage.getItem("lastPage") || "/";
      router.push(last);
      localStorage.removeItem("lastPage");
    } catch (error) {
      showError(error.message || "Login failed");
    }
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      showError("Passwords do not match");
      return;
    }
    try {
      const { message } = await apiService.auth.register({
        name,
        email,
        password,
        repeatPassword,
      });
      await refreshUser(); // fetch fresh user info
      showSuccess(message || "Account created successfully!");
      const last = localStorage.getItem("lastPage") || "/";
      router.push(last);
      localStorage.removeItem("lastPage");
    } catch (error) {
      showError(error.message || "Signup failed");
    }
  };

  return (
    <div className="w-[80%] h-[80%] bg-white rounded-2xl shadow-xl py-[5rem] px-[10rem]">
      {/* Tab Buttons */}
      <div className="flex relative mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 text-center text-2xl cursor-pointer pb-2 mb-[-1] transition-colors ${
            activeTab === "login"
              ? "text-ogr"
              : "text-black hover:text-gray-400"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 text-center text-2xl cursor-pointer pb-2 mb-[-1] transition-colors ${
            activeTab === "signup"
              ? "text-ogr"
              : "text-black hover:text-gray-400"
          }`}
        >
          Sign Up
        </button>

        {/* Animated underline */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute bottom-0 h-0.5 bg-sgr"
          style={{
            width: "50%",
            left: activeTab === "login" ? "0%" : "50%",
          }}
        />
      </div>

      {/* Form Container */}
      {activeTab === "login" ? (
        <motion.form
          key="login-form"
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-4 mt-[2rem]"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border-b-2 text-2xl border-gray-200 focus:border-sgr outline-none py-2 px-1 transition"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border-b-2 text-2xl border-gray-200 focus:border-sgr outline-none py-2 px-1 transition"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-sgr text-3xl text-black py-2 rounded-lg hover:bg-ogr hover:text-white transition-all duration-300 cursor-pointer"
          >
            Login
          </button>
        </motion.form>
      ) : (
        <motion.form
          key="signup-form"
          onSubmit={handleSignup}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-4 mt-[2rem]"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border-b-2 text-2xl border-gray-200 focus:border-sgr outline-none py-2 px-1 transition"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border-b-2 text-2xl border-gray-200 focus:border-sgr outline-none py-2 px-1 transition"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border-b-2 text-2xl border-gray-200 focus:border-sgr outline-none py-2 px-1 transition"
            required
          />
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Repeat Password"
            className="border-b-2 text-2xl border-gray-200 focus:border-sgr outline-none py-2 px-1 transition"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-sgr text-3xl text-black py-2 rounded-lg hover:bg-ogr hover:text-white  transition-all duration-300 cursor-pointer"
          >
            Sign Up
          </button>
        </motion.form>
      )}
      <FeatureCounterCarousel data={features} interval={5000} />
    </div>
  );
}
