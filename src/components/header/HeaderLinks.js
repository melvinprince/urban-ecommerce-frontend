import Link from "next/link";

const headerLinks = [
  { id: 1, text: "Home", link: "/" },
  { id: 2, text: "Categories", link: "/categories" },
  { id: 3, text: "Help", link: "/help" },
];

export default function HeaderLinks() {
  return (
    <>
      {headerLinks.map(({ id, text, link }) => (
        <Link
          key={id}
          href={link}
          className="header-link-wrapper relative overflow-hidden px-4 py-2 font-bold text-background group"
        >
          <span className="relative z-10">{text}</span>
          <span className="header-link-bg absolute inset-0 bg-ogr translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
        </Link>
      ))}
    </>
  );
}
