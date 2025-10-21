import type { NextConfig } from 'next'

const API_BASE = process.env.NEXT_SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/math'],

  async rewrites() {
    // Proxy browser requests from /graphql → your real backend
    return [
      {
        source: '/graphql',
        destination: `${API_BASE.replace(/\/+$/, '')}/graphql`,
      },
    ]
  },
}

export default nextConfig
