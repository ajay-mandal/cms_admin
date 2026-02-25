/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            }
        ]
    },
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push({
                '@prisma/client': 'commonjs @prisma/client',
                'bcryptjs': 'commonjs bcryptjs',
            });
        }
        return config;
    },
    async headers() {
        return [
            {
                // matching all API path
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET, DELETE, POST, PUT, OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization"}
                ]
            }
        ]
    }
}

module.exports = nextConfig
