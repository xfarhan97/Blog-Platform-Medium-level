/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "picsum.photos" },
      { hostname: "fastly.picsum.photos" },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
