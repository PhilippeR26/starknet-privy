import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  webpack: (
    config, options
  ) => {
    //config.module.noParse = [require.resolve("typescript/lib/typescript.js")]
    //config.externals = 'coffee-script';
    return config
  },
  // turbopack: {
  //   rules: {
  //     '*test*.ts': {
  //       loaders: [],
  //       as: '*.noop.js', // or skip processing
  //     },
  //     'test/*': {
  //       loaders: [],
  //       as: '*.noop.js', // or skip processing
  //     },
  //     '*.md': {
  //       loaders: [],
  //       as: '*.noop.js', // or skip processing
  //     },
  //   },
  // },
}

module.exports = nextConfig
