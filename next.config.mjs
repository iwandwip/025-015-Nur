/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@prisma/client', 'lucide-react', 'recharts'],
    turbo: {
      rules: {
        '*.sqlite': {
          loaders: ['ignore-loader'],
        },
        '*.db': {
          loaders: ['ignore-loader'],
        },
      },
    },
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
};

export default nextConfig;