import CategorySection from "./CategorySection";

export default function ShopByCategory() {
  const data = {
    women: {
      name: "Womens Collections",
      categories: [
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
      ],
    },
    men: {
      name: "Mens Collections",
      categories: [
        {
          title: "Urban Hoodies",
          image: "/images/categories/urban-hoodies.jpeg",
          link: "/categories/men/urban-hoodies",
          text: "Stay cozy while looking sharp with our collection of urban hoodies.",
          button: "Shop Hoodies",
        },
        {
          title: "Cargo Pants",
          image: "/images/categories/cargo-pants.jpeg",
          link: "/categories/men/cargo-pants",
          text: "Utility meets style with the ultimate cargo pants for your urban wardrobe.",
          button: "Get Cargos",
        },
        {
          title: "Bomber Jackets",
          image: "/images/categories/bomber-jackets.jpeg",
          link: "/categories/men/bomber-jackets",
          text: "Classic bombers with a street twist. Your new everyday essential.",
          button: "See Bombers",
        },
      ],
    },
    kids: {
      name: "Kids Collections",
      categories: [
        {
          title: "Mini Streetwear",
          image: "/images/categories/mini-streetwear.jpeg",
          link: "/categories/kids/mini-streetwear",
          text: "Let the little ones flex in style! Urban outfits designed just for kids.",
          button: "Shop Now",
        },
        {
          title: "Denim Overalls",
          image: "/images/categories/denim-overalls.jpeg",
          link: "/categories/kids/denim-overalls",
          text: "Play hard, look good. Urban overalls built for comfort and style.",
          button: "Get Overalls",
        },
        {
          title: "Printed Tees",
          image: "/images/categories/printed-tees.jpeg",
          link: "/categories/kids/printed-tees",
          text: "Fun, bold prints for the next generation of street stars.",
          button: "Shop Tees",
        },
      ],
    },
    shoes: {
      name: "Shoes Collections",
      categories: [
        {
          title: "Chunky Sneakers",
          image: "/images/categories/chunky-sneakers.jpeg",
          link: "/categories/shoes/chunky-sneakers",
          text: "Step into boldness. Chunky sneakers for the fearless urban vibe.",
          button: "Get Sneakers",
        },
        {
          title: "High-Top Sneakers",
          image: "/images/categories/high-top-sneakers.jpeg",
          link: "/categories/shoes/high-top-sneakers",
          text: "Elevate your step. High-tops made for the streets.",
          button: "Shop High-Tops",
        },
        {
          title: "Skate Shoes",
          image: "/images/categories/skate-shoes.jpeg",
          link: "/categories/shoes/skate-shoes",
          text: "Grip. Style. Vibes. Skate shoes that move with you.",
          button: "Grab Yours",
        },
      ],
    },
    accessories: {
      name: "Accessories Collections",
      categories: [
        {
          title: "Bucket Hats",
          image: "/images/categories/bucket-hats.jpeg",
          link: "/categories/accessories/bucket-hats",
          text: "Street-ready bucket hats to top off any look.",
          button: "Shop Hats",
        },
        {
          title: "Crossbody Bags",
          image: "/images/categories/crossbody-bags.jpeg",
          link: "/categories/accessories/crossbody-bags",
          text: "Compact, practical, and made for the grind. Urban crossbody essentials.",
          button: "See Bags",
        },
        {
          title: "Statement Chains",
          image: "/images/categories/statement-chains.jpeg",
          link: "/categories/accessories/statement-chains",
          text: "Shine bright with bold chains that complete your urban drip.",
          button: "Shop Chains",
        },
      ],
    },
  };

  return (
    <div className="flex items-center justify-around flex-col">
      {Object.keys(data).map((key) => (
        <CategorySection key={key} sectionData={data[key]} />
      ))}
    </div>
  );
}
