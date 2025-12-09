/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true, // Required for Cloudflare Pages
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'riblaeditores.com',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'galxhiecepfemzxeovny.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

module.exports = nextConfig;
