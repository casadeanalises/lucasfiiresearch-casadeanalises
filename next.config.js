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

  // Configuração do webpack para canvas e PDF
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Não tentar resolver módulos nativos no lado do cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
        path: false,
      };
    }

    // Ignorar arquivos binários do canvas
    config.module.rules.push({
      test: /node_modules\/canvas/,
      use: 'null-loader'
    });

    return config;
  },

  // Otimizações adicionais
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true
  },

  // Configurações para ignorar erros de pré-renderização
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  staticPageGenerationTimeout: 1000,
  output: 'standalone',
};

module.exports = nextConfig; 