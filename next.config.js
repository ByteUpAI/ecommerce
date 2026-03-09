const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {},
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'dxlnfef9j.cloudinary.com',
                port: '',
                pathname: '/**',
            }
        ]
    },
    transpilePackages: ['ckeditor5'],
    webpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            ckeditor5: path.resolve(__dirname, 'node_modules', 'ckeditor5'),
            '@ckeditor': path.resolve(__dirname, 'node_modules', '@ckeditor'),
        };

        return config;
    },
};

module.exports = nextConfig;
