"use client";

import dynamic from "next/dynamic";

const HeaderCartContent = dynamic(() => import("./HeaderCartContent"), {
  ssr: false,
});

export default function HeaderCart({ totalItems }) {
  return <HeaderCartContent totalItems={totalItems} />;
}
