"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { isLoggedIn, hydrated, initializeAuth, setRedirectPath } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initializeAuth(); // Always initialize first

    if (hydrated && !isLoggedIn) {
      setRedirectPath("/checkout");
      router.push("/user/login-register");
    }
  }, [hydrated, isLoggedIn, setRedirectPath, router]);

  if (!hydrated || !isLoggedIn) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div>
      <h1>Checkout Page</h1>
    </div>
  );
}
