import { motion } from "framer-motion";
import SvgIcon from "./SvgIcon";

export default function Button({ text }) {
  return (
    <button className="bg-white text-black text-3xl font-semibold py-[1rem] px-[2rem] rounded-full flex items-center gap-1 group-hover:scale-105 transition-transform duration-300 hover:cursor-pointer">
      {text}{" "}
      <motion.span
        whileHover={{
          rotate: [0, 10, -10, 10, -10, 0],
          transition: { duration: 0.6 },
        }}
        className="bg-background rounded-full p-5 ml-5 flex items-center justify-center"
      >
        <SvgIcon src="/svg/doubleArrow-right.svg" width={15} height={15} />
      </motion.span>
    </button>
  );
}
