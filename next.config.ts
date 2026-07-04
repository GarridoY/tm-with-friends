import "./src/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'core.trackmania.nadeo.live',
            },
            {
                protocol: 'https',
                hostname: 'trackmania.exchange',
            },
        ],
    },
};

export default nextConfig;
