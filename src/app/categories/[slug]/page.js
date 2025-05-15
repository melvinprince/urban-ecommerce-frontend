import { Suspense } from "react";
import Loader from "@/components/common/Loader";
import CategoryProductsContent from "@/components/products/CategoryProductsContent";

export default function CategoryProductsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<Loader />}>
        <CategoryProductsContent />
      </Suspense>
    </div>
  );
}
