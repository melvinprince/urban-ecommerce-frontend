"use client";

import { useEffect } from "react";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

const headerLinks = [
  { id: 1, text: "Home", link: "/" },
  { id: 2, text: "Categories", link: "/categories" },
  { id: 3, text: "Contact", link: "/contact" },
  { id: 4, text: "Help", link: "/help" },
];

export default function Header() {
  const { isLoggedIn, logout, user, hydrated, initializeAuth } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();

  useEffect(() => {
    initializeAuth();
    fetchCart();
  }, [initializeAuth, fetchCart]);

  if (!hydrated) return null;

  return (
    <header className="flex justify-between items-center bg-ogr p-4">
      <div className="text-2xl font-bold text-white">Urban Home</div>

      <nav className="flex items-center gap-[2rem]">
        {headerLinks.map(({ id, text, link }) => (
          <Link
            key={id}
            href={link}
            className="text-lg text-sgr hover:text-white"
          >
            {text}
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
              <Link href="/user/profile" className="text-lg text-sgr">
                Welcome, {user.name.split(" ")[0]}
              </Link>
            )}

            {user?.role === "adm" && (
              <Link href="/admin" className="text-lg text-sgr hover:text-white">
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="text-lg text-sgr hover:text-white"
            >
              Sign Out
            </button>
          </>
        )}

        <Link href="/cart" className="relative text-sgr hover:text-white">
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
