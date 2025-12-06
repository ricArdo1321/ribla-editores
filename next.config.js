/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
        ],
    },
};

module.exports = nextConfig;
