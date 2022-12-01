/** @type {import('next').NextConfig} */

import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'


const withMDX = nextMDX({
  // By default only the .mdx extension is supported.
  extension: /\.mdx?$/,
  options: {
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [remarkGfm]
  }
});

const nextConfig = withMDX({
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})

export default nextConfig;
