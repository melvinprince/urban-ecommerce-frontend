"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { title: "About Us", link: "/about" },
  { title: "Contact Us", link: "/contact" },
  { title: "Privacy Policy", link: "/privacy-policy" },
  { title: "Terms of Service", link: "/terms-of-service" },
  { title: "FAQ", link: "/faq" },
  { title: "Returns & Exchanges", link: "/returns-exchanges" },
  { title: "Shipping Information", link: "/shipping-information" },
];

export default function FooterMainLinks() {
  return (
    <motion.ul
      className="flex flex-col space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {links.map((item) => (
        <motion.li
          key={item.link}
          className="text-2xl text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
          whileHover={{ x: 4, color: "#ffffff" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link href={item.link}>
            <span className="block">{item.title}</span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}
