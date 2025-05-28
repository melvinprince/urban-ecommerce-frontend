import CategorySection from "./categoryCard/CategorySection";

const data = {
  name: "Kids Collections",
  categories: [
    {
      title: "Kids Streetwear",
      image: "/images/categories/mini-streetwear.jpeg",
      link: "/categories/kids/mini-streetwear",
      text: "Let the little ones flex in style! Urban outfits designed just for kids.",
      button: "Shop StreetWear",
    },
    {
      title: "Denim Overalls",
      image: "/images/categories/denim-overalls.jpeg",
      link: "/categories/kids/denim-overalls",
      text: "Play hard, look good. Urban overalls built for comfort and style.",
      button: "Get Denim",
    },
    {
      title: "Printed Tees",
      image: "/images/categories/printed-tees.jpeg",
      link: "/categories/kids/printed-tees",
      text: "Fun, bold prints for the next generation of street stars.",
      button: "Buy Tees",
    },
    {
      title: "Casual Dresses",
      image: "/images/categories/girl-boy.jpeg",
      link: "/categories/kids/printed-tees",
      text: "Fun, bold prints for the next generation of street stars.",
      button: "Shop Casuals",
    },
  ],
};

export default function KidsShowcase() {
  return (
    <div className="mx-[5rem] my-[5rem]">
      <CategorySection sectionData={data} />
    </div>
  );
}
