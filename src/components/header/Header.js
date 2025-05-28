"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import HeaderLinks from "./HeaderLinks";
import HeaderAuth from "./HeaderAuth";
import HeaderCart from "./HeaderCart";

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const hydrated = useAuthStore((state) => state.hydrated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const { totalItems, fetchCart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeAuth();
    fetchCart();
  }, [initializeAuth, fetchCart]);

  useEffect(() => {
    // When pathname changes (new page loads), stop loading
    if (loading) {
      setLoading(false);
    }
  }, [pathname]); // runs every time the path changes

  if (!hydrated) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="grid grid-cols-3 justify-center items-center bg-black px-[5rem] py-[2rem] gap-4">
      <HeaderLogo />
      <HeaderSearch
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        loading={loading}
      />
      <nav className="justify-self-end flex items-center gap-[2rem] text-2xl font-bold text-background">
        <HeaderLinks />
        <HeaderAuth isLoggedIn={isLoggedIn} user={user} logout={logout} />
        <HeaderCart totalItems={totalItems} />
      </nav>
    </header>
  );
}
