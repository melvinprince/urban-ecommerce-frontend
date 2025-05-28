"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ArrowButton from "./ArrowButton";
import SvgIcon from "@/components/common/SvgIcon";
import Button from "@/components/common/Button";

export default function CarouselBlock({ data = [], index = 0, next, prev }) {
  return (
    <div className="relative w-full aspect-[3/2] rounded-[25px] overflow-hidden shadow-xl">
      <AnimatePresence initial={false}>
        {data.map((item, i) =>
          i === index ? (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href={item.link} className="block w-full h-full">
                <Image
                  src={item.image}
                  alt={item.text || `slide-${i}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute top-[20%] w-[50rem] left-[10%]  text-black">
                  {item.text && (
                    <p className="text-[5rem] font-eulogy">{item.text}</p>
                  )}
                  {item.button && <Button text={item.button} />}
                </div>
              </Link>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {data.length > 1 && (
        <>
          <ArrowButton direction="left" onClick={prev} />
          <ArrowButton direction="right" onClick={next} />
        </>
      )}
    </div>
  );
}
