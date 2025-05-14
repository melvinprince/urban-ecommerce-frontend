"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import PopupAlert from "@/components/PopupAlert";

export default function Page() {
  const [activeTab, setActiveTab] = useState("login");

  const { login, isLoggedIn, initializeAuth } = useAuthStore(); // Zustand magic!

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Popup states
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("token", data.token);
      login(data.token);

      setPopupType("success");
      setPopupMessage("Login Successful");
      window.location.href = "/";
    } catch (error) {
      setPopupType("error");
      setPopupMessage(error.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setPopupType("error");
      setPopupMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, repeatPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("token", data.token);
      login(data.token);

      setPopupType("success");
      setPopupMessage("Signup Successful");
    } catch (error) {
      setPopupType("error");
      setPopupMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        {/* Show Popup */}
        {popupMessage && (
          <PopupAlert
            type={popupType}
            message={popupMessage}
            onClose={() => setPopupMessage("")}
          />
        )}

        {/* If logged in */}
        {isLoggedIn ? (
          <div className="text-center">
            <p>You are logged in.</p>
          </div>
        ) : (
          <>
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

            {/* Forms */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border p-2 mb-4"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border p-2 mb-4"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2"
                >
                  Login
                </button>
              </form>
            )}

            {activeTab === "signup" && (
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full border p-2 mb-4"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border p-2 mb-4"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border p-2 mb-4"
                />
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Repeat Password"
                  className="w-full border p-2 mb-4"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white p-2"
                >
                  Sign Up
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
