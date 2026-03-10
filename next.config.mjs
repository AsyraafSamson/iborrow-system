if (process.env.NODE_ENV === 'development') {
  const { getPlatformProxy } = await import('wrangler')
  const proxy = await getPlatformProxy()
  globalThis.__cfPlatformEnv = proxy.env
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
