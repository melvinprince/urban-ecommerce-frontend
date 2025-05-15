"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { loginUser, registerUser } from "@/lib/api"; // API methods
import usePopupStore from "@/store/popupStore"; // 🆕 Global popup store
import PopupAlert from "@/components/PopupAlert"; // To render globally

export default function Page() {
  const [activeTab, setActiveTab] = useState("login");

  const { login, isLoggedIn, initializeAuth, redirectPath, setRedirectPath } =
    useAuthStore();

  const { showSuccess, showError } = usePopupStore.getState(); // 🆕 Get popup methods

  const router = useRouter();
  const pathname = usePathname();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirectPath || "/");
      setRedirectPath("/");
    }
  }, [isLoggedIn, redirectPath, router, setRedirectPath]);

  useEffect(() => {
    const lastVisitedPage = localStorage.getItem("lastPage");
    if (!lastVisitedPage || lastVisitedPage === "/user/login-register") {
      localStorage.setItem("lastPage", "/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, message } = await loginUser({ email, password });

      localStorage.setItem("token", data.token);
      login(data.token);

      showSuccess(message || "Logged in successfully!"); // 🆕 Show success

      const destination = localStorage.getItem("lastPage") || "/";
      router.push(destination);
      localStorage.removeItem("lastPage");
    } catch (error) {
      showError(error.message || "Login failed"); // 🆕 Show error
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      showError("Passwords do not match"); // 🆕 Show error
      return;
    }

    try {
      const { data, message } = await registerUser({
        name,
        email,
        password,
        repeatPassword,
      });

      localStorage.setItem("token", data.token);
      login(data.token);

      showSuccess(message || "Account created successfully!"); // 🆕 Show success

      const destination = localStorage.getItem("lastPage") || "/";
      router.push(destination);
      localStorage.removeItem("lastPage");
    } catch (error) {
      showError(error.message || "Signup failed"); // 🆕 Show error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        {/* Popup is globally rendered */}

        {/* Tabs */}
        {!isLoggedIn ? (
          <>
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
        ) : (
          <div className="text-center">
            <p>Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
