import ShoeCarousel from "./ShoeCarousel";

const data = [
  {
    text: "Men's Sport Sneakers",
    subline:
      "Unleash your stride in style. Engineered for speed, designed for your lifestyle.",
    button: "Explore Men's Collection",
    link: "/products/sporty-runner",
    image: "/images/shoesShowcase/mens.jpeg",
    color: "white",
  },
  {
    text: "Chic Women's Trainers",
    subline:
      "Effortless fashion meets unbeatable comfort. Step into confidence, every day.",
    button: "Discover Women's Styles",
    link: "/products/sporty-runner",
    image: "/images/shoesShowcase/womens.jpeg",
    color: "black",
  },
  {
    text: "Cool Kicks for Kids",
    subline:
      "For every step, every smile. Designed to keep up with their boundless energy.",
    button: "Shop Kids' Sneakers",
    link: "/products/sporty-runner",
    image: "/images/shoesShowcase/kids.jpeg",
    color: "black",
  },
  {
    text: "Unisex Everyday Kicks",
    subline:
      "Designed for all, worn by all. Versatile comfort for every adventure.",
    button: "Browse Unisex Range",
    link: "/products/sporty-runner",
    image: "/images/shoesShowcase/unisex.jpeg",
    color: "white",
  },
];

export default function ShoeShowcase() {
  return (
    <div className="mx-[5rem] my-[10rem]">
      <ShoeCarousel data={data} />;
    </div>
  );
}
