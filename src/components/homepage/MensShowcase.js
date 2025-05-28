import DualImageShowcase from "./dualShowcase/DualImageShowcase";

export default function MensShowcase() {
  const carouselItems = [
    {
      image: "/images/mensSection/accessories.jpeg",
      link: "/collections/urban-essentials",
      text: "Finish Strong: Accessories That Elevate",
      button: "Explore Accessories",
    },
    {
      image: "/images/mensSection/bag.jpeg",
      link: "/collections/street-style",
      text: "Carry the Streets: Bold Urban Bags",
      button: "Shop Bags",
    },
    {
      image: "/images/mensSection/boots.jpeg",
      link: "/collections/new-arrivals",
      text: "Step Up: Boots for Every Hustle",
      button: "Discover Boots",
    },
  ];

  const sideBanner = {
    image: "/images/mensSection/pant.jpeg",
    link: "/collections/limited-drop",
    text: "Tough Looks: Pants That Work Hard",
    button: "Shop Pants",
  };

  const carouselItems2 = [
    {
      image: "/images/mensSection/mens-jacket.jpeg",
      link: "/collections/urban-essentials",
      text: "Own the Cold: Jackets That Speak",
      button: "Shop Jackets",
    },
    {
      image: "/images/mensSection/casual-shoes.jpeg",
      link: "/collections/street-style",
      text: "Casual, But Make It Street",
      button: "Explore Shoes",
    },
    {
      image: "/images/mensSection/bag-2.jpeg",
      link: "/collections/new-arrivals",
      text: "Bold Bags for Bold Moves",
      button: "Shop Bags",
    },
  ];

  const sideBanner2 = {
    image: "/images/mensSection/jacket.jpeg",
    link: "/collections/limited-drop",
    text: "Limited Edition: Urban Jackets",
    button: "Grab Yours",
  };

  return (
    <div className="my-[10rem] mx-[5rem] flex flex-col gap-[3rem] h-[80vh]">
      <DualImageShowcase
        carouselData={carouselItems}
        sideData={sideBanner}
        reverse={false}
        autoPlay={true}
        interval={5000}
        className="rounded-2xl"
      />
      <DualImageShowcase
        carouselData={carouselItems2}
        sideData={sideBanner2}
        reverse={true}
        autoPlay={true}
        interval={4000}
        className="rounded-2xl"
      />
    </div>
  );
}
