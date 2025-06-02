"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AuthCarousel({ data }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [data.length]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence>
        {/*
          Wrap each slide in a motion.div so Framer Motion can fade it in/out.
          We use key={index} so that AnimatePresence knows when to unmount/mount.
        */}
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Parent is relative, so Image fill will cover it */}
          <Image
            src={data[index].image}
            alt={`carousel-slide-${index}`}
            fill
            className="object-cover object-top"
            priority={true}
          />

          {/* Overlay with gradient and text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center px-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center"
            >
              {data[index].text}
            </motion.h2>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
