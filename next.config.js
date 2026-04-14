/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Enable source maps for production debugging (optional, can be disabled)
  productionBrowserSourceMaps: false, // Set to true if you need source maps
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.google.com", // Google Maps scripts
              "style-src 'self' 'unsafe-inline' https://*.googleapis.com https://fonts.googleapis.com", // Google Maps and Fonts styles
              "img-src 'self' data: https: blob: https://*.googleapis.com https://*.google.com https://*.gstatic.com", // Google Maps images
              "font-src 'self' data: https://fonts.gstatic.com", // Google Fonts
              "connect-src 'self' https: https://*.googleapis.com https://*.google.com https://*.supabase.co", // Google Maps + Supabase API calls
              "frame-src 'self' https://*.google.com https://*.googleapis.com", // Google Maps iframes
              "child-src 'self' https://*.google.com https://*.googleapis.com", // Google Maps iframes (older browsers)
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "media-src 'self'"
            ].join('; ')
          }
        ],
      },
    ]
  },
  // Optimize bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
              },
              name(module) {
                const hash = require('crypto').createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                return require('crypto').createHash('sha1').update(chunks.reduce((acc, chunk) => acc + chunk.name, '')).digest('hex').substring(0, 8);
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
