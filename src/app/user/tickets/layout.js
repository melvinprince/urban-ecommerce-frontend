"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import usePopupStore from "@/store/popupStore";

export default function Ticketlayout({ children }) {
  const { isLoggedIn, initializeAuth, hydrated } = useAuthStore();
  const { showError } = usePopupStore();
  const router = useRouter();

  useEffect(() => {
    initializeAuth(); // run once on mount
  }, [initializeAuth]);

  useEffect(() => {
    if (hydrated && isLoggedIn === false) {
      showError("You need to log in or register to access tickets");
      router.push("/user/login-register");
    }
  }, [hydrated, isLoggedIn, showError, router]);

  if (!hydrated) return null;

  if (hydrated && isLoggedIn === false) return null;

  return <div>{children}</div>;
}
