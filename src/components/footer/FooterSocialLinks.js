"use client";

import { motion } from "framer-motion";
import SvgIcon from "../common/SvgIcon";

const socials = [
  {
    title: "Facebook",
    icon: "/svg/facebook.svg",
    link: "https://www.facebook.com",
  },
  {
    title: "Instagram",
    icon: "/svg/instagram.svg",
    link: "https://www.instagram.com",
  },
  {
    title: "Twitter",
    icon: "/svg/twitter.svg",
    link: "https://www.twitter.com",
  },
  {
    title: "LinkedIn",
    icon: "/svg/linkedin.svg",
    link: "https://www.linkedin.com",
  },
  {
    title: "YouTube",
    icon: "/svg/youtube.svg",
    link: "https://www.youtube.com",
  },
  {
    title: "Pinterest",
    icon: "/svg/pinterest.svg",
    link: "https://www.pinterest.com",
  },
];

export default function FooterSocialLinks() {
  return (
    <motion.div
      className="flex gap-[1rem] mt-[2rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
    >
      {socials.map((social) => (
        <motion.a
          key={social.title}
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-15 h-15 flex items-center justify-center rounded-full bg-sgr hover:bg-ogr transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <SvgIcon src={social.icon} alt={social.title} />
        </motion.a>
      ))}
    </motion.div>
  );
}
