/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
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
