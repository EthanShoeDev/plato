import withBundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Merge MDX config with Next.js config
export default bundleAnalyzer(withMDX(nextConfig));
