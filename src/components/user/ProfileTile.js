"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";

export default function ProfileTile({ href, src, title, description }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-ogr rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer h-[30rem] w-[30rem] flex flex-col items-center justify-center"
    >
      <Link href={href} className="p-6 flex flex-col items-center">
        <div className="p-4 bg-white/20 rounded-full">
          <Player
            autoplay
            loop
            src={src}
            style={{ height: "128px", width: "128px" }}
          />
        </div>
        <h2 className="mt-4 text-5xl font-medium text-white">{title}</h2>
        <p className="mt-2 text-white/80 text-2xl text-center">{description}</p>
      </Link>
    </motion.div>
  );
}
