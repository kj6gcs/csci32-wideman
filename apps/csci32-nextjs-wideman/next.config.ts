import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/math'], // 👈 add your internal packages here
}

export default nextConfig
