import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    // Aquí es donde agregas el dominio de Cloudinary
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
