import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCheckoutStore = create(
  persist(
    (set) => ({
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
      fromBuyNow: false, // ✅ NEW FLAG

      setAddress: (address) => set({ address }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setBuyNowProduct: (product) =>
        set({ buyNowProduct: product, fromBuyNow: true }), // ✅ SET FLAG
      clearBuyNowProduct: () => set({ buyNowProduct: null, fromBuyNow: false }), // ✅ CLEAR FLAG
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
          fromBuyNow: false, // ✅ RESET FLAG
        }),
    }),
    {
      name: "checkout-storage", // persisted in localStorage
    }
  )
);

export default useCheckoutStore;
