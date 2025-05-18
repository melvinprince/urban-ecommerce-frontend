import Loader from "@/components/common/Loader";
import OrderDetailPage from "@/components/orders/OrderDetailPage";
import { Suspense } from "react";

export default function OrderDetailWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <OrderDetailPage />
    </Suspense>
  );
}
