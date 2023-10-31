/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent calling useEffect twice
  reactStrictMode: false,
  images: {
    domains: ["preview.redd.it", "is5-ssl.mzstatic.com"],
  },
};

module.exports = nextConfig;
