"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import CarouselBlock from "./CarouselBlock";
import SideImageBlock from "./SideImageBlock";

export default function DualImageShowcase({
  carouselData = [],
  sideData = null,
  autoPlay = true,
  interval = 5000,
  reverse = false,
  className = "",
}) {
  if (!carouselData.length || !sideData) {
    throw new Error(
      "Provide at least one carouselData item and one sideData object"
    );
  }

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % carouselData.length);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, carouselData.length]);

  const next = () => setIndex((i) => (i + 1) % carouselData.length);
  const prev = () =>
    setIndex((i) => (i === 0 ? carouselData.length - 1 : i - 1));

  return (
    <div
      className={clsx(
        "flex w-full h-[40vh] gap-[3rem]",
        reverse ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      <CarouselBlock
        data={carouselData}
        index={index}
        next={next}
        prev={prev}
      />
      <SideImageBlock data={sideData} />
    </div>
  );
}
