/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'core.trackmania.nadeo.live',
            },
        ],
    },
};

export default nextConfig;
