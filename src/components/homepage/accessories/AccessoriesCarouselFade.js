"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function AccessoriesCarouselFade({
  images,
  interval = 5000,
  withTextOverlay = false,
  className = "",
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  const currentImage = images[current];

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Link
            href={currentImage.link || "#"}
            className="block w-full h-full relative"
          >
            <Image
              src={currentImage.image}
              alt={currentImage.alt}
              fill
              className="object-cover object-top"
            />
            {withTextOverlay && currentImage.text && currentImage.button && (
              <div className="absolute top-[50%] translate-y-[-50%] left-[10%] text-black ">
                <h3 className="text-[5rem] font-eulogy">{currentImage.text}</h3>
                <Button text={currentImage.button} className="mt-4" />
              </div>
            )}
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
