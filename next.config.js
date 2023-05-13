/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/frontend',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"],
  },
};

module.exports = nextConfig;
