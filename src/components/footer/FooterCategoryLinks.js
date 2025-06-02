"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  { title: "Mens", link: "/category/mens" },
  { title: "Womens", link: "/category/womens" },
  { title: "Kids", link: "/category/kids" },
  { title: "Shoes", link: "/category/shoes" },
  { title: "Accessories", link: "/category/accessories" },
];

export default function FooterCategoryLinks() {
  return (
    <motion.ul
      className="flex flex-col space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
    >
      {categories.map((cat) => (
        <motion.li
          key={cat.link}
          className="text-2xl text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
          whileHover={{ x: 4, color: "#ffffff" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link href={cat.link}>
            <span className="block">{cat.title}</span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
