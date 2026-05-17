import path from 'node:path';
import { fileURLToPath } from 'node:url';
import createMDX from '@next/mdx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx'],

  reactStrictMode: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    // Rust-based MDX. Faster, and importantly: its options are serializable
    // (Turbopack requires that). Rehype/remark plugins go through the Rust
    // pipeline, so we keep them empty here and rely on highlight.js classes
    // already baked into the MDX (or apply highlighting client-side later).
    mdxRs: true,
  },

  // Path aliases — match the Vite ones used in the original source.
  // Note: Turbopack expects relative paths in resolveAlias, while webpack
  // expects absolute. Bare aliases ('@data') need to point at the barrel
  // file directly; slashed aliases ('@data/foo') resolve into the dir.
  turbopack: {
    resolveExtensions: ['.mdx', '.jsx', '.js', '.tsx', '.ts', '.json'],
    resolveAlias: {
      '@': './src',
      '@components': './src/components/index.js',
      '@components/*': './src/components/*',
      '@config': './src/config',
      '@features': './src/features',
      '@hooks': './src/hooks/index.js',
      '@hooks/*': './src/hooks/*',
      '@seo': './src/seo',
      '@data': './src/data/index.js',
      '@data/*': './src/data/*',
      '@styles': './src/styles',
      '@lib': './src/lib',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@seo': path.resolve(__dirname, 'src/seo'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    };
    return config;
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
