import Loader from "@/components/common/Loader";
import OrdersPage from "@/components/orders/OrdersPage";
import { Suspense } from "react";

export default function OrdersPageWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <OrdersPage />
    </Suspense>
  );
}
