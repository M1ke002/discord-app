/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['utfs.io']
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;
