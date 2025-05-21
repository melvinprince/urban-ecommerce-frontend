// frontend/src/store/checkoutStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { applyCoupon as apiApplyCoupon } from "@/lib/api";

const useCheckoutStore = create(
  persist(
    (set, get) => ({
      address: {
        fullName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        postalCode: "",
        country: "",
      },
      paymentMethod: "",
      buyNowProduct: null,
      fromBuyNow: false,

      subtotal: 0,
      coupon: null,
      error: null,

      setAddress: (address) => set({ address }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setBuyNowProduct: (product) =>
        set({ buyNowProduct: product, fromBuyNow: true }),
      clearBuyNowProduct: () => set({ buyNowProduct: null, fromBuyNow: false }),
      clearCheckout: () =>
        set({
          address: {
            fullName: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            postalCode: "",
            country: "",
          },
          paymentMethod: "",
          buyNowProduct: null,
          fromBuyNow: false,
          subtotal: 0,
          coupon: null,
          error: null,
        }),

      setSubtotal: (amount) => set({ subtotal: amount }),

      // use the named export from lib/api.js
      applyCoupon: async (code) => {
        const subtotal = get().subtotal;
        const email = get().address.email; // <— include email
        try {
          const res = await apiApplyCoupon(code, subtotal, email);
          // res.data is { code, type, value, discount }
          set({ coupon: res.data, error: null });
        } catch (err) {
          set({
            error:
              err.response?.data?.message ||
              err.message ||
              "Failed to apply coupon.",
          });
        }
      },

      clearCoupon: () => set({ coupon: null, error: null }),
    }),
    {
      name: "checkout-storage", // persisted in localStorage
    }
  )
);

export default useCheckoutStore;
