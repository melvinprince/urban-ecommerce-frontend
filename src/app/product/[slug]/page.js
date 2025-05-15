import { Suspense } from "react";
import Loader from "@/components/common/Loader";
import ProductDetailContent from "@/components/productDetail/ProductDetailContent";

export default function ProductDetailPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Suspense fallback={<Loader />}>
        <ProductDetailContent />
      </Suspense>
    </div>
  );
}
