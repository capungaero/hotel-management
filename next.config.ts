import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Static generation optimization
  generateEtags: true,
  
  // Ensure proper chunk loading
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  
  // Build settings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // React optimization
  reactStrictMode: true,
};

export default nextConfig;
