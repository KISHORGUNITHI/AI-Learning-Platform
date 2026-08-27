import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  turbopack: {
    // Point Turbopack to this workspace root to suppress lockfile warnings
    // when a parent directory also has a package-lock.json
    root: __dirname,
  },
  // Required for next-mdx-remote v6 with Turbopack
  transpilePackages: ['next-mdx-remote'],
};

export default nextConfig;
