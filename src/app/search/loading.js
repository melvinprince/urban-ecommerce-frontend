"use client";

import Loader from "@/components/common/Loader";

export default function Loading() {
  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );
}
