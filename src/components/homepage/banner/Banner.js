"use client";

import Carousel from "./Index";

const data = [
  {
    image: "/images/homeBanner/man-and-women-urban.png",
    text: "Bold, urban fashion for men and women. Elevate your everyday style with pieces designed for the modern lifestyle.",
    category: "Urban Fashion",
    order: "left",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/urban-1748203998858`,
    buttonText: "Explore Urban Collection",
  },
  {
    image: "/images/homeBanner/kids-urban.png",
    text: "Fun, durable, and trend-forward—kids’ fashion that keeps up with their adventures. Let their style shine.",
    category: "Kids Fashion",
    order: "right",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/kids-1748203998858`,
    buttonText: "Shop Kids Fashion",
  },
  {
    image: "/images/homeBanner/man-urban-fashion.png",
    text: "Upgrade your look with men’s urban essentials—designed for bold style, all-day comfort, and effortless versatility.",
    category: "Mens Fashion",
    order: "left",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/mens-1748203998858`,
    buttonText: "Shop Men's Collection",
  },
  {
    image: "/images/homeBanner/women-urban-fashion.png",
    text: "From chic basics to bold statements—express your style with women’s urban fashion that stands out.",
    category: "Womens Fashion",
    order: "right",
    link: `${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/womens-1748203998858`,
    buttonText: "Discover Women's Styles",
  },
];

export default function Banner() {
  return (
    <div className="h-[80vh] mx-[5rem] my-[4rem] rounded-[25px] overflow-hidden">
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
