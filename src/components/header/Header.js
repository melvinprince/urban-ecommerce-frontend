const headerLinks = [
  {
    Id: 1,
    text: "Home",
    link: "/",
  },
  {
    Id: 2,
    text: "About",
    link: "/about",
  },
  {
    Id: 3,
    text: "Contact",
    link: "/contact",
  },
  {
    Id: 4,
    text: "Login/Register",
    link: "/user/login-register",
  },
];

export default function Header() {
  return (
    <div>
      <div className="flex justify-between items-center bg-ogr p-4">
        <div className=" text-2xl">Urban Home</div>
        <nav className="space-x-4 flex gap-[1rem]">
          {headerLinks.map((link) => (
            <a
              key={link.Id}
              href={link.link}
              className="text-lg text-sgr hover:text-white"
            >
              {link.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
