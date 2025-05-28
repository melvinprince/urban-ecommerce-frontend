"use client";

import Carousel from "./Index";

const data = [
  {
    image: "/images/homeBanner/man-and-women-urban.png",
    text: "Explore the ultimate in urban fashion for men and women. From bold streetwear to timeless essentials, our collection is designed to elevate your everyday look. Step into a world where style meets comfort, perfect for the modern lifestyle. Discover statement pieces that turn heads wherever you go. Shop now and redefine your wardrobe with our exclusive urban styles.",
    category: "Urban Fashion",
    order: "left",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/urban-1748203998858`,
    buttonText: "Explore Urban Collection",
  },
  {
    image: "/images/homeBanner/kids-urban.png",
    text: "Give your little ones a stylish edge with our trendy kids' fashion collection. Designed for comfort and durability, our range features playful prints, vibrant colors, and must-have essentials for every season. Whether it's for school, playtime, or special occasions, your kids deserve the best. Shop now and dress them in outfits they'll love. Style, fun, and function all in one place.",
    category: "Kids Fashion",
    order: "right",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/kids-1748203998858`,
    buttonText: "Shop Kids Fashion",
  },
  {
    image: "/images/homeBanner/man-urban-fashion.png",
    text: "Upgrade your wardrobe with the latest in men's urban fashion. From casual streetwear to refined essentials, our collection is curated for the modern man who values comfort, style, and versatility. Discover statement pieces that effortlessly blend into your lifestyle. Make every outfit count with our bold and functional designs. Shop now for the freshest looks in men's fashion.",
    category: "Mens Fashion",
    order: "left",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/mens-1748203998858`,
    buttonText: "Shop Men's Collection",
  },
  {
    image: "/images/homeBanner/women-urban-fashion.png",
    text: "Find your perfect outfit with our exclusive range of women's urban fashion. From chic everyday basics to eye-catching statement pieces, our collection empowers you to express your unique style. Crafted with premium fabrics and trend-forward designs, these outfits are made to turn heads. Whether you're heading to work, brunch, or a night out, we've got you covered. Elevate your style with our curated collection.",
    category: "Womens Fashion",
    order: "right",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/womens-1748203998858`,
    buttonText: "Discover Women's Styles",
  },
];

export default function Banner() {
  return (
    <div className="h-[80vh] m-[5rem] px-[2rem] border border-ogr rounded-[25px] overflow-hidden shadow-lg">
      <Carousel>
        {data.map((slide, index) => (
          <Carousel.Slide
            key={index}
            image={slide.image}
            text={slide.text}
            category={slide.category}
            order={slide.order}
            link={slide.link}
            buttonText={slide.buttonText}
          />
        ))}
      </Carousel>
    </div>
  );
}
