"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    initializeAuth();
    fetchCart();
  }, [initializeAuth, fetchCart]);

  if (!hydrated) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center bg-ogr p-4 gap-4">
      {/* Logo */}
      <div className="text-2xl font-bold text-white">Urban Home</div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full sm:max-w-md flex gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-black"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Search
        </button>
      </form>

      {/* Navigation */}
      <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
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
