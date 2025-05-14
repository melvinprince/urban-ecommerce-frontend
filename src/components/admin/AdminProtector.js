"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function AdminProtector({ children }) {
  const { isLoggedIn, user, hydrated, initializeAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initializeAuth(); // Always call to make sure Zustand is populated
  }, [initializeAuth]);

  useEffect(() => {
    if (hydrated) {
      if (!isLoggedIn || user?.role !== "adm") {
        router.push("/"); // 🚫 Not admin? Send to home
      }
    }
  }, [hydrated, isLoggedIn, user, router]);

  if (!hydrated) {
    return <div>Loading...</div>; // Optional spinner
  }

  return <>{isLoggedIn && user?.role === "adm" && children}</>;
}
