import CategoryProductShowcase from "./showcase/CategoryProductsShowcase";

export default function WomensShowcase() {
  const categories = [
    {
      title: "Oversized Streetwear",
      image: "/images/categories/oversized-streetwear.jpeg",
      link: "/categories/women/oversized-streetwear",
      text: "Bold, effortless, and made for the city. Shop the latest oversized urban looks for women.",
      button: "Shop Oversized",
    },
    {
      title: "Denim Jackets",
      image: "/images/categories/denim-jackets.jpeg",
      link: "/categories/women/denim-jackets",
      text: "From light wash to ripped, denim jackets are the ultimate layer for street style.",
      button: "Explore Denim",
    },
    {
      title: "Graphic Tees",
      image: "/images/categories/graphic-tees.jpeg",
      link: "/categories/women/graphic-tees",
      text: "Make a statement with bold prints and edgy designs for your everyday vibe.",
      button: "See Tees",
    },
    {
      title: "Bucket Hats",
      image: "/images/categories/bucket-hats.jpeg",
      link: "/categories/women/graphic-teess",
      text: "Make a statement with bold prints and edgy designs for your everyday vibes.",
      button: "See Tees s",
    },
  ];

  const products = [
    {
      id: "1",
      title: "Womend Dress Item - 90 QAR",
      image: "/images/showcase/womens-showcase-1.png",
      link: "/product/black-cargo-pants",
    },
    {
      id: "2",
      title: "Womend Dress Item - 140 QAR",
      image: "/images/showcase/womens-showcase-2.jpeg",
      link: "/product/oversized-hoodie",
    },
    {
      id: "3",
      title: "Womend Dress Item - 50 QAR",
      image: "/images/showcase/womens-showcase-3.jpeg",
      link: "/product/retro-sneakers",
    },
  ];
  return (
    <div className="mx-[5rem] my-[10rem]">
      <CategoryProductShowcase
        categories={categories}
        products={products}
        reverse={true}
        carouselProps={{ autoplayDelay: 5000, showDots: true }}
        cardVariant="default"
        className="my-12"
      />
    </div>
  );
}
