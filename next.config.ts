import type { NextConfig } from 'next';

function getImageRemotePatterns() {
  const raw = process.env.NEXT_PUBLIC_IMAGE_HOSTNAMES ?? '';
  const hostnames = raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  return hostnames.flatMap((hostname) => {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return [
        { protocol: 'http' as const, hostname },
        { protocol: 'https' as const, hostname },
      ];
    }

    return [{ protocol: 'https' as const, hostname }];
  });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: getImageRemotePatterns(),
  },

  // Строгий режим для production
  typescript: {
    // В production сборка упадёт при ошибках TS
    ignoreBuildErrors: false,
  },

  // Оптимизация bundle
  experimental: {
    optimizePackageImports: ['lucide-react', '@reduxjs/toolkit'],
  },
};

export default nextConfig;
