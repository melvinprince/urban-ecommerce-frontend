"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";

export default function SideImageBlock({ data }) {
  return (
    <motion.div
      /* parent controls the hover state for everything inside */
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative w-1/3 hidden md:block overflow-hidden bg-sgr border rounded-[25px] shadow-2xl"
    >
      <Link href={data.link} className="block w-full h-full relative">
        {/* ---------- IMAGE ---------- */}
        <motion.div
          variants={{
            rest: { y: "0%" },
            hover: { y: "-35%" },
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={data.image}
            alt={data.text || "side"}
            fill
            sizes="33vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* ---------- TEXT / BUTTON ---------- */}
        <motion.div
          variants={{
            rest: { y: "100%", opacity: 0 },
            hover: { y: "0%", opacity: 1 },
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 right-0 bg-ogr text-white p-4 flex flex-col items-center justify-center z-10"
        >
          {data.text && (
            <p className="text-2xl font-semibold mb-2 text-center">
              {data.text}
            </p>
          )}
          {data.button && <Button text={data.button} />}
        </motion.div>
      </Link>
    </motion.div>
  );
}
