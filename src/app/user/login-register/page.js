"use client";

import PopupAlert from "@/components/PopupAlert";
import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("login");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Popup states
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setPopupType("success");
      setPopupMessage("Login Successful ✅");
      console.log(data);
    } catch (error) {
      setPopupType("error");
      setPopupMessage(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setPopupType("error");
      setPopupMessage("Passwords do not match ❌");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password, repeatPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setPopupType("success");
      setPopupMessage("Signup Successful ✅");
      console.log(data);
    } catch (error) {
      setPopupType("error");
      setPopupMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        {/* Show Popup if message exists */}
        {popupMessage && (
          <PopupAlert
            type={popupType}
            message={popupMessage}
            onClose={() => setPopupMessage("")}
          />
        )}

        {/* Tab Switcher */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 p-2 ${
              activeTab === "login" ? "border-b-2 border-black" : ""
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 p-2 ${
              activeTab === "signup" ? "border-b-2 border-black" : ""
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label>Email</label>
              <input
                type="email"
                className="w-full border p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label>Password</label>
              <input
                type="password"
                className="w-full border p-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full p-2 bg-black text-white">
              Login
            </button>
          </form>
        )}

        {activeTab === "signup" && (
          <form onSubmit={handleSignup}>
            <div className="mb-4">
              <label>Name</label>
              <input
                type="text"
                className="w-full border p-2"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label>Email</label>
              <input
                type="email"
                className="w-full border p-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label>Password</label>
              <input
                type="password"
                className="w-full border p-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label>Repeat Password</label>
              <input
                type="password"
                className="w-full border p-2"
                placeholder="Repeat your password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full p-2 bg-black text-white">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
