/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos", "localhost", "urban-demo.roi.qa"], // Keep this
    remotePatterns: [
      {
        protocol: "https",
        hostname: "urban-demo.roi.qa",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
