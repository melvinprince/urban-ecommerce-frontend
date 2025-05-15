// src/app/loading.js
import Loader from "@/components/common/Loader";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader />
    </div>
  );
}
