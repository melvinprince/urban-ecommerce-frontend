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

      setAddress: (address) => set({ address }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setBuyNowProduct: (product) => set({ buyNowProduct: product }),
      clearBuyNowProduct: () => set({ buyNowProduct: null }),
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
        }),
    }),
    {
      name: "checkout-storage", // persisted in localStorage
    }
  )
);

export default useCheckoutStore;
