/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@neondatabase/serverless"]
  }
};

export default nextConfig;
