"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import Link from "next/link";

const headerLinks = [
  { Id: 1, text: "Home", link: "/" },
  { Id: 2, text: "About", link: "/about" },
  { Id: 3, text: "Contact", link: "/contact" },
];

export default function Header() {
  const { isLoggedIn, logout, user, hydrated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="flex justify-between items-center bg-ogr p-4">
      <div className="text-2xl">Urban Home</div>
      <nav className="space-x-4 flex gap-4 items-center">
        {headerLinks.map((link) => (
          <Link
            key={link.Id}
            href={link.link}
            className="text-lg text-sgr hover:text-white"
          >
            {link.text}
          </Link>
        ))}

        {!isLoggedIn ? (
          <Link
            href="/user/login-register"
            className="text-lg text-sgr hover:text-white"
          >
            Login/Register
          </Link>
        ) : (
          <>
            {user?.name && (
              <span className="text-lg text-sgr">
                Welcome, {user.name.split(" ")[0]} 👋
              </span>
            )}
            <button
              onClick={logout}
              className="text-lg text-sgr hover:text-white"
            >
              Sign Out
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
