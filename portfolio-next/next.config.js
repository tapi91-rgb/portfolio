/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // allows static export
  experimental: {
    typedRoutes: true
  },
  images: {
    unoptimized: true
  }
};
export default nextConfig;