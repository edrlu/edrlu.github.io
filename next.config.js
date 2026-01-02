/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,
  basePath: '',  // Empty for GitHub Pages user site
}

module.exports = nextConfig
