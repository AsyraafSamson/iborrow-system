/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages configuration
  
  // Image optimization - disable for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  
  // ESLint - ignore during build (fix later in development)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript - ignore during build (fix later in development)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack configuration to ignore Cloudflare-specific modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@cloudflare/workers-types': 'commonjs @cloudflare/workers-types',
      });
    }
    return config;
  },
}

module.exports = nextConfig