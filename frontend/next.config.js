/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil'
    });

    return config;
  },
  images: {
    domains: ['utfs.io']
  },
  experimental: {
    serverActions: true
  }
};

module.exports = nextConfig;
