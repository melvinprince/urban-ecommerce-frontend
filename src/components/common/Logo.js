import Image from "next/image";
import Link from "next/link";

export default function Logo({ h, w }) {
  return (
    <div className={`h-[${h}] w-[${w}] relative`}>
      <Link href="/" className="">
        <Image
          src="/brandData/URBAN-logo-transparent.png"
          alt="Urban-logo"
          fill
          className="object-fit hover:scale-102 transition-transform duration-300 ease-in-out"
        />
      </Link>
    </div>
  );
}
