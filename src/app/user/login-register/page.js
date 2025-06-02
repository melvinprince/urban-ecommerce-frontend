// app/user/login-register/page.jsx
"use client";

import AuthCarousel from "@/components/LoginRegister/AuthCarousel";
import AuthForm from "@/components/LoginRegister/AuthForm";

// Example carousel data. Replace these URLs/text with your own.
const data = [
  {
    image: "/images/loginRegister/carousel1.png",
    text: "Discover the Future of Urban Style",
  },
  {
    image: "/images/loginRegister/carousel2.png",
    text: "Seamless Shopping, Seamless Experience",
  },
  {
    image: "/images/loginRegister/carousel3.png",
    text: "Join Our Community of Trendsetters",
  },
];

export default function Page() {
  return (
    <div className="flex h-[60vh]">
      {/* Left Side: Carousel */}
      <div className="w-2/3 hidden lg:block relative">
        <AuthCarousel data={data} />
      </div>

      {/* Right Side: Login / Register Form */}
      <div className="w-1/3 flex items-center justify-center bg-gray-50">
        <AuthForm />
      </div>
    </div>
  );
}
