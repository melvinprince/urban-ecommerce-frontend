import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className={`h-[5rem] w-[15rem] relative`}>
      <Link href="/">
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
