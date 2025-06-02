"use client";

import Logo from "../common/Logo";
import { motion } from "framer-motion";
import FooterMainLinks from "./FooterMainLinks";
import FooterCategoryLinks from "./FooterCategoryLinks";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterNewsletter from "./FooterNewsletter";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <motion.div
        className="mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {/* Logo + Brief */}
        <motion.div
          className="flex flex-col space-y-4 max-w-[90%] mx-auto"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
        >
          <Logo />
          <p className="text-lg leading-relaxed w-[80%] text-justify">
            Urban E-commerce brings you the latest in fashion, delivered to your
            doorstep with style and ease. Follow us on social to stay updated
            with exclusive drops and promotions.
          </p>
          <FooterSocialLinks />
        </motion.div>

        {/* Main Links */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
          className="mx-auto"
        >
          <h3 className="text-5xl font-eulogy text-white mb-4">Company</h3>
          <FooterMainLinks />
        </motion.div>

        {/* Category Links */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6 }}
          className="mx-auto"
        >
          <h3 className="text-5xl font-eulogy text-white mb-4">Shop</h3>
          <FooterCategoryLinks />
        </motion.div>
        <FooterNewsletter />
      </motion.div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center text-lg text-gray-500">
          <p>
            © {new Date().getFullYear()} Urban E-commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
