import dynamic from "next/dynamic";

// Lazy load Player to avoid large bundle size
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false }
);

export default function SaleBadge({ discountPercent }) {
  return (
    <div className="absolute top-2 left-0 z-10 h-fit flex bg-red-700 w-fit px-[1rem] rounded-r-full">
      <div className="flex items-center justify-center">
        <span className="text-white text-xl">{discountPercent}% OFF</span>
      </div>
      <Player
        autoplay
        loop
        src="/json/sale.json"
        style={{ height: "30px", width: "30px" }}
      />
    </div>
  );
}
