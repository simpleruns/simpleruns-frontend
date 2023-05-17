/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/frontend',
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
