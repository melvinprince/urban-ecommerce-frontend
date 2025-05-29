"use client";

import AccessoriesCarouselCube from "./accessories/AccessoriesCarouselCube";
import AccessoriesCarouselFade from "./accessories/AccessoriesCarouselFade";
import AccessoriesImage from "./accessories/AccessoriesImages";

const data = {
  staticImages: [
    {
      link: "/products/3",
      image: "/images/accessories/earrings.jpeg",
      alt: "Hat",
      button: "Shop Earrings",
    },
    {
      link: "/products/1",
      image: "/images/accessories/bracelet.jpeg",
      alt: "Watch",
      button: "Shop Bracelet",
    },
    {
      link: "/products/2",
      image: "/images/accessories/cap.jpeg",
      alt: "Bracelet",
      button: "Shop Cap",
    },
    {
      link: "/products/3",
      image: "/images/accessories/necklace.jpeg",
      alt: "necklace",
      button: "Shop Necklace",
    },
    {
      link: "/products/3",
      image: "/images/accessories/ring.jpeg",
      alt: "ring",
      button: "Shop Ring",
    },
  ],
  carousel1: [
    {
      link: "/products/4",
      image: "/images/accessories/bag1.jpeg",
      alt: "Bag 1",
      button: "Explore Bag 1",
    },
    {
      link: "/products/5",
      image: "/images/accessories/bag2.jpeg",
      alt: "Bag 2",
      button: "Explore Bag 2",
    },
    {
      link: "/products/6",
      image: "/images/accessories/bag3.jpeg",
      alt: "Bag 3",
      button: "Explore Bag 3",
    },
  ],
  carousel2: [
    {
      link: "/products/7",
      image: "/images/accessories/carousel1.jpeg",
      alt: "Men's Accessories",
      text: "Bold Accents for Modern Men",
      button: "Explore Men's Accessories",
    },
    {
      link: "/products/8",
      image: "/images/accessories/carousel2.jpeg",
      alt: "Female Accessories",
      text: "Shine Bright with Style",
      button: "Discover Women's Picks",
    },
    {
      link: "/products/9",
      image: "/images/accessories/couple.jpeg",
      alt: "Matching Couple Accessories",
      text: "Perfect Pair for Every Bond",
      button: "View Couple's Collection",
    },
  ],
};

export default function AccessoriesShowcase() {
  const { staticImages, carousel1, carousel2 } = data;

  return (
    <div className="mx-[5rem] my-[10rem] max-w-screen flex flex-col gap-[2rem] rounded-[200px] overflow-hidden shadow-2xl">
      {/* Top Row - 1/3 */}
      <div className="h-[30vh] grid grid-cols-5 gap-[2rem] ">
        <AccessoriesImage {...staticImages[0]} />
        <AccessoriesCarouselCube images={carousel1} className="" />
        <AccessoriesImage {...staticImages[2]} />
        <AccessoriesImage {...staticImages[3]} />
        <AccessoriesImage {...staticImages[4]} />
      </div>

      {/* Bottom Row - 2/3 */}
      <div className="h-[50vh] grid grid-cols-5 gap-4">
        <AccessoriesImage {...staticImages[1]} />
        <AccessoriesCarouselFade
          images={carousel2}
          withTextOverlay
          className="col-span-4"
        />
      </div>
    </div>
  );
}
