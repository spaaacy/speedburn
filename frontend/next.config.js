/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent calling useEffect twice
  reactStrictMode: false,
  // Allow all domains for development
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
