/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração de imagens
  images: {
    domains: ['images.unsplash.com', 'img.youtube.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      }
    ],
  },
  
  // Otimizações para PDF
  async headers() {
    return [
      {
        source: '/api/reports/pdfs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Otimizações adicionais
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true
  },
};

module.exports = nextConfig; 