import { Suspense } from "react";
import Loader from "@/components/common/Loader";
import CartContent from "@/components/cart/CartContent";

export default function CartPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <Suspense fallback={<Loader />}>
        <CartContent />
      </Suspense>
    </div>
  );
}
