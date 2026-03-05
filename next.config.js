const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev')

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform().catch(console.error)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Back to normal Next.js for Cloudflare Pages with Functions
  images: {
    unoptimized: true,
  },

  // Disable type checking during build  
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
