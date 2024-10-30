/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false
    }
    ,
    images: {
        remotePatterns: [
            {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            }
        ]
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
