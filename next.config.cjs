import { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

// const bundleAnalyzer = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// });

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
