/** @type {import('next').NextConfig} */

import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE == 'true',
})



const withMDX = nextMDX({
  // By default only the .mdx extension is supported.
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [remarkGfm]
  }
});

const nextConfig = withBundleAnalyzer(
  withMDX({
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    webpack: (config, { isServer }) => {
      if (!isServer && config.mode != 'development') {
        config.module.rules.push({
          test: /.*react-syntax-highlighter.*/,
          use: "null-loader",
        })
      }
      return config;
    }
  })
);

export default nextConfig;
